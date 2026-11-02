import LibertyIQPublicSpeakingTrainer from "@/components/libertyiq-public-speaking-trainer"
import { ProFeature } from "@/components/pro-feature"

export default function Page() {
  return (
    <ProFeature
      title="Speaking trainer"
      description="Practice speeches with filler-word analysis. Patriot Pass includes it for 365 days. A Topic Pack does not."
    >
      <LibertyIQPublicSpeakingTrainer />
    </ProFeature>
  )
}
