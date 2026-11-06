import { abilities } from "../constants";
import {
  DeliveryProgress,
  FeaturesSection,
  LiveChat,
  QualityTracker,
} from "../components/ui/feature";

// Same order as `abilities`.
const VISUALS = [QualityTracker, LiveChat, DeliveryProgress];

const items = abilities.map((ability, index) => ({ ...ability, Visual: VISUALS[index] }));

const FeatureCards = () => <FeaturesSection eyebrow="How I work" items={items} />;

export default FeatureCards;
