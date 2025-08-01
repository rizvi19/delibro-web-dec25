
'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Send, X, Loader2, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { askHelpline } from '@/app/actions';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

export default function HelplineChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          role: 'bot',
          content: "Hello! I'm the delibro AI assistant. How can I help you today?",
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await askHelpline(input);

    if (response.success) {
      const botMessage: Message = { role: 'bot', content: response.data };
      setMessages((prev) => [...prev, botMessage]);
    } else {
      const errorMessage: Message = {
        role: 'bot',
        content: "Sorry, I couldn't get a response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className={cn('fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out', 
        isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
      )}>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-background/80 backdrop-blur-sm border-2 border-primary text-primary shadow-lg hover:bg-primary/10"
        >
          <Sparkles className="w-8 h-8" />
        </Button>
      </div>

      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        )}
      >
        <Card className="w-[350px] h-[500px] shadow-2xl flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between bg-accent p-4">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg font-headline">AI Helpline</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn('flex items-start gap-3', {
                    'justify-end': message.role === 'user',
                  })}
                >
                  {message.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn('p-3 rounded-lg max-w-[80%]', {
                      'bg-primary text-primary-foreground': message.role === 'user',
                      'bg-accent': message.role === 'bot',
                    })}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="p-3 rounded-lg bg-accent">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                </div>
                )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}
