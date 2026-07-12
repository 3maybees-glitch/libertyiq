import LibertyIQPublicSpeakingTrainer from "@/components/libertyiq-public-speaking-trainer"
import { ProFeature } from "@/components/pro-feature"

export default function Page() {
  return (
    <ProFeature
      title="Speaking trainer is Core"
      description="Practice speeches with filler-word analysis and coaching tips with LibertyIQ Core or Lifetime."
    >
      <LibertyIQPublicSpeakingTrainer />
    </ProFeature>
  )
}
