import { useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'

export default function VoiceChatbot({ context = 'general' }) {
  const [open, setOpen]           = useState(false)
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [chatId, setChatId]       = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording]   = useState(false)
  const [isSpeaking, setIsSpeaking]     = useState(false)

  const mediaRef    = useRef(null)
  const chunksRef   = useRef([])
  const scrollRef   = useRef(null)
  const audioRef    = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const push = (role, content) =>
    setMessages((prev) => [...prev, { role, content }])

  const sendText = async (text) => {
    if (!text.trim() || isLoading) return
    push('user', text)
    setInput('')
    setIsLoading(true)

    try {
      const res = await api.chat(text, chatId)
      const reply = res.content ?? ''
      if (res.chat_id) setChatId(res.chat_id)
      push('assistant', reply)
      speakReply(reply)
    } catch {
      push('assistant', 'Sorry, I could not reach the assistant right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const speakReply = async (text) => {
    try {
      setIsSpeaking(true)
      const blob = await api.tts(text)
      const url  = URL.createObjectURL(blob)
      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(url)
      }
      audio.play()
    } catch {
      setIsSpeaking(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const mr = new MediaRecorder(stream)
      mediaRef.current = mr

      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const fd   = new FormData()
        fd.append('audio', blob, 'recording.webm')
        setIsLoading(true)
        try {
          const res = await api.stt(fd)
          const transcript = res.text ?? ''
          if (transcript) {
            await sendText(transcript)
          }
        } catch {
          push('assistant', 'Could not transcribe audio. Please try typing instead.')
        } finally {
          setIsLoading(false)
        }
      }

      mr.start()
      setIsRecording(true)
    } catch {
      push('assistant', 'Microphone access denied. Please type your message.')
    }
  }

  const stopRecording = () => {
    mediaRef.current?.stop()
    setIsRecording(false)
  }

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeaking(false)
  }

  const placeholder = context === 'buyer'
    ? 'Ask about market prices, districts…'
    : 'Ask about crop yields, harvesting tips…'

  const greeting = context === 'buyer'
    ? '👋 I\'m your AgroPulse market assistant. Ask me about crop prices, supply levels, or which district to buy from.'
    : '👋 I\'m your farming assistant. Ask me about harvest timing, crop diseases, or market readiness.'

  const handleOpen = () => {
    setOpen(true)
    if (messages.length === 0) {
      push('assistant', greeting)
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        title="AI Assistant"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white text-2xl transition-all duration-200 ${
          open ? 'bg-gray-600 rotate-45' : 'bg-forest-700 hover:bg-forest-800'
        }`}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-forest-800 text-white">
            <span className="text-lg">🌿</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-none">AgroPulse AI</p>
              <p className="text-[11px] text-forest-200 mt-0.5">
                {isSpeaking ? '🔊 Speaking…' : isLoading ? 'Thinking…' : 'Ready'}
              </p>
            </div>
            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="text-xs px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 font-medium"
              >
                Stop
              </button>
            )}
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
            style={{ maxHeight: '340px', minHeight: '200px' }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-forest-700 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                  <span className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-bounce"
                        style={{ animationDelay: `${d * 150}ms` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input row */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 bg-white">
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={isLoading}
              className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-40`}
              title="Hold to speak"
            >
              🎤
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendText(input)}
              placeholder={placeholder}
              disabled={isLoading || isRecording}
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-forest-500 disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() => sendText(input)}
              disabled={!input.trim() || isLoading || isRecording}
              className="shrink-0 w-9 h-9 rounded-full bg-forest-700 text-white flex items-center justify-center hover:bg-forest-800 disabled:opacity-40 transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
