import AIAssistantForm from '@/components/ai-assistant-form';
import { Sparkles } from 'lucide-react';

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">AI Meeting Assistant</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Let our AI find the most convenient meeting point and time for you and
          the recipient.
        </p>
      </div>
      <AIAssistantForm />
    </div>
  );
}
