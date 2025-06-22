export interface AiModel {
  id: string;
  name: string;
  description: string;
  cost: 'low' | 'high';
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  isHtml?: boolean;
  typing?: boolean;
  error?: boolean;
  isInitial?: boolean;
}

export const models: AiModel[] = [
  {
    id: 'o4-mini',
    name: 'o4-mini',
    description: '고급 이성에 가장 빠름',
    cost: 'low'
  },
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    description: '(고비용)빠르게 코딩 및 분석할때 탁월',
    cost: 'high'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: '(고비용)대부분의 업무에 탁월함',
    cost: 'high'
  }
]; 