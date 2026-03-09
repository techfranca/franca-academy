import {
  Briefcase, FileText, BarChart3, PenTool, Users, Target,
  TrendingUp, Shield, Award, BookOpen, Calculator, ClipboardList,
  DollarSign, Globe, Heart, Lightbulb, MessageCircle, Phone,
  PieChart, Search, Settings, Star, Zap, Building2,
  type LucideProps,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Briefcase, FileText, BarChart3, PenTool, Users, Target,
  TrendingUp, Shield, Award, BookOpen, Calculator, ClipboardList,
  DollarSign, Globe, Heart, Lightbulb, MessageCircle, Phone,
  PieChart, Search, Settings, Star, Zap, Building2,
}

interface DynamicIconProps extends LucideProps {
  name: string
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = ICON_MAP[name] || Briefcase
  return <IconComponent {...props} />
}
