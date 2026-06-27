import { useState } from 'react'
import { IMAGES } from '../../data/images'
import { useAgroPulse } from '../../context/useAgroPulse'
import CropSelectStep from './CropSelectStep'
import VolumeStep from './VolumeStep'
import TimelineStep from './TimelineStep'
import MoFAVerification from './MoFAVerification'

const STEPS = ['crop', 'volume', 'timeline', 'success']

export default function QuickLogWizard({ onCropChange, onDistrictChange }) {
  const { submitHarvest } = useAgroPulse()
  const [step, setStep] = useState('crop')
  const [crop, setCrop] = useState(null)
  const [volume, setVolume] = useState(50)
  const [submitting, setSubmitting] = useState(false)
  const [mofaId, setMofaId] = useState('')
  const [district, setDistrict] = useState('Techiman')
  const [farmerName, setFarmerName] = useState('')

  const stepIndex = STEPS.indexOf(step)

  const handleCropSelect = (selected) => {
    setCrop(selected)
    onCropChange?.(selected)
    setStep('volume')
  }

  const handleDistrictChange = (value) => {
    setDistrict(value)
    onDistrictChange?.(value)
  }

  const handleSubmit = async (timeline) => {
    setSubmitting(true)
    await submitHarvest({
      crop,
      volume,
      timelineId: timeline.id,
      district,
      mofaId: mofaId.trim(),
      farmerName: farmerName.trim() || 'Anonymous Farmer',
      phone: `+233${Math.floor(Date.now() / 1000) % 1000000000}`,
    })
    setStep('success')
    setSubmitting(false)
  }

  const reset = () => {
    setStep('crop')
    setCrop(null)
    setVolume(50)
    setSubmitting(false)
  }

  if (step === 'success') {
    return (
      <div className="text-center py-4">
        <img
          src={IMAGES.crops[crop]}
          alt={crop}
          className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-forest-200"
        />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-700 text-sm font-semibold mb-3">
          ✓ Harvest Logged!
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-1">
          {volume} bags of {crop}
        </p>
        <p className="text-sm text-gray-500 mb-2">{district} · Buyers notified via AgroPulse</p>
        <p className="text-xs text-gray-400 mb-6">
          The market panel on the right will refresh with updated supply data.
        </p>
        <button
          type="button"
          onClick={reset}
          className="w-full py-3.5 rounded-xl bg-forest-700 text-white font-bold hover:bg-forest-800 transition-colors"
        >
          Log Another Harvest
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-6">
        {STEPS.slice(0, 3).map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= stepIndex ? 'bg-forest-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 -mt-4 mb-5 font-medium">
        Step {Math.min(stepIndex + 1, 3)} of 3
      </p>

      {step === 'crop' && (
        <CropSelectStep onSelect={handleCropSelect} />
      )}

      {step === 'volume' && (
        <VolumeStep
          crop={crop}
          volume={volume}
          onVolumeChange={setVolume}
          onNext={() => setStep('timeline')}
          onBack={() => setStep('crop')}
        />
      )}

      {step === 'timeline' && (
        <TimelineStep
          crop={crop}
          volume={volume}
          onSubmit={handleSubmit}
          onBack={() => setStep('volume')}
          submitting={submitting}
        />
      )}

      <MoFAVerification
        mofaId={mofaId}
        onMofaIdChange={setMofaId}
        district={district}
        onDistrictChange={handleDistrictChange}
        farmerName={farmerName}
        onFarmerNameChange={setFarmerName}
      />
    </div>
  )
}
