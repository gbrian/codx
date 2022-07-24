import RTCMulticonnection from './AsyncRTCMulticonnection'
import io from 'socket.io-client'

window.io = io

function randomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toLowerCase();
}
function makeid (slots) {
  const res = []
  for(let c = 0; c < slots; ++c) {
    res.push(randomString(3))
  }
  return res.join("-")
}

export default class WebRTCRoom {
  connection = null
  screenConnection = null
  roomId = null
  streams = {}
  onStreamsChanged = () => {}

  constructor (settings) {
    this.roomSettings = settings
    this.connection = this.createConnection(settings)
  }

  createConnection (settings) {
    const { video, audio, screen } = settings
    const connection = RTCMulticonnection()
    connection.socketURL = `${process.env.VUE_APP_API}/`
    // STUN / TURN Servers
    if (settings.webrtc) {
      const { stunServer, turnServer, turnPassword, turnUser } = settings.webrtc
      connection.iceServers = []
      connection.iceServers.push({
        urls: stunServer
      })
      connection.iceServers.push({
        urls: turnServer,
        credential: turnPassword,
        username: turnUser
      })
      connection.iceTransportPolicy = 'relay'
    }
    connection.session = {
        audio,
        video: video === true ? true : video ? { deviceId: video } : null,
        screen,
        data: true
    }
    connection.mediaConstraints = {
      audio: audio === true ? true : audio ? { deviceId: audio } : null, 
      video: video === true ? true : video ? { deviceId: video } : null
    }
    this.setCodecs({ connection })
    connection.extra = this.encodeExtra(settings)
    connection.onstream = this.onStream.bind(this)
    connection.onstreamended = this.onStreamEnded.bind(this)
    connection.onmute = this.onMute.bind(this)
    connection.onunmute = this.onUnMute.bind(this)

    return connection
  }

  setCodecs ({ connection, resolutions = "HD", bitrates = 512 }) {
    const CodecsHandler = connection.CodecsHandler
    connection.processSdp = function(sdp) {
        var codecs = 'vp8'
        console.log("processSdp", sdp)

        if (resolutions == 'HD') {
            sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
                audio: 128,
                video: bitrates,
                screen: bitrates
            });

            sdp = CodecsHandler.setVideoBitrates(sdp, {
                min: bitrates * 8 * 1024,
                max: bitrates * 8 * 1024,
            });
        }

        if (resolutions == 'Ultra-HD') {
            sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
                audio: 128,
                video: bitrates,
                screen: bitrates
            });

            sdp = CodecsHandler.setVideoBitrates(sdp, {
                min: bitrates * 8 * 1024,
                max: bitrates * 8 * 1024,
            });
        }

        if (codecs.length) {
            sdp = CodecsHandler.preferCodec(sdp, codecs.toLowerCase());
        }

        return sdp;
    };
  }

  static async newRoom (settings) {
    const room = new WebRTCRoom(settings)
    const { onStreamsChanged } = settings
    if (onStreamsChanged) {
      room.onStreamsChanged = onStreamsChanged
    }
    await room.connect(settings)
    return room
  }

  shareScreen () {
  }

  async connect ({ roomId: name }) {
    this.roomId = name || makeid(3)
    const { isRoomCreated, roomId } = await this.connection.openOrJoin(this.roomId)
    console.log("rtc", "Room openend", isRoomCreated, roomId)
  }

  encodeExtra (extra) {
    return encodeURIComponent(JSON.stringify(extra))
  }

  decodeExtra (extra) {
    try {
      return JSON.parse(decodeURIComponent(extra))
    } catch (ex) {
      console.error('Error decoding user extra', ex)
    }
    return {}
  }

  disconnect () {
    const { connection } = this
    // disconnect with all users
    connection.getAllParticipants().forEach(pid => connection.disconnectWith(pid));

    // stop all local cameras
    connection.attachStreams.forEach(localStream => localStream.stop());

    // close socket.io connection
    connection.closeSocket()
    this.connection = null
  }

  onStream(event) {
    const { streams } = this
    const extra = this.decodeExtra(event.extra)
    this.streams = {
      ...streams,
      [extra.userid]: {
        ...event,
        extra
      }
    }
    if (event.type === 'local') {
      if (!this.connection.session.video) {
        this.toggleVideo()
      }
    }
    this.onStreamsChanged(this)
  }

  onStreamEnded (event) {
    const { streamid } = event
    const k = Object.keys(this.streams).filter(k => this.streams[k].streamid === streamid)[0]
    if (k) {
      delete this.streams[k]
      this.onStreamsChanged(this)
    }
  }

  get socket () {
    const { connection: { socket } } = this
    return socket
  }

  get allStreams () {
    const { streams } = this
    return Object.values(streams)
  }

  get myStreams () {
    return this.allStreams
      .filter(s => s.type === 'local')
  }

  onMute (event) {
    const { streamid, muteType } = event
    const stream = this.allStreams.filter(s => s.streamid === streamid)[0]
    if (muteType === 'video') {
      if (stream.paused)
        return
      stream.paused = true
    }
    if (muteType === 'audio') {
      if (stream.muted)
        return
      stream.muted = true
    }
    this.onStreamsChanged(this)
    console.log("onmute", event)
  }

  onUnMute (event) {
    const { streamid, unmuteType } = event
    const stream = this.allStreams.filter(s => s.streamid === streamid)[0]
    if (unmuteType === 'video') {
      if (!stream.paused)
        return
      stream.paused = false
    }
    if (unmuteType === 'audio') {
      if (!stream.muted)
        return
      stream.muted = false
    }
    this.onStreamsChanged(this)
    console.log("onunmute", event)
  }

  toggleVideo () {
    const isAudioMuted = this.myStreams[0].muted
    this.myStreams.forEach(s => {
      if (s.paused) {
        s.stream.unmute('video')
      } else {
        s.stream.mute('video')
      }
      if (isAudioMuted) {
        s.stream.mute('audio')
      } else {
        s.stream.unmute('audio')
      }
    })
  }

  toggleAudio () {
    this.myStreams.forEach(s => s.muted ? s.stream.unmute('audio') : s.stream.mute('audio'))
  }
}