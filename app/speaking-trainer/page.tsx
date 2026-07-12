import LibertyIQPublicSpeakingTrainer from "@/components/libertyiq-public-speaking-trainer"
import { ProFeature } from "@/components/pro-feature"

export default function Page() {
  return (
    <ProFeature
      title="Speaking trainer is Pro"
      description="Practice speeches with filler-word analysis and coaching tips after unlocking LibertyIQ Pro."
    >
      <LibertyIQPublicSpeakingTrainer />
    </ProFeature>
  )
}
