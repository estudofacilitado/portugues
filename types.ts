
export interface BonusItem {
  id: string;
  title: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  isHighlighted?: boolean;
}
