"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How do I use bolt.new to chat with AI?",
    answer: "Simply create a new workspace, enter your prompt, and our AI will respond instantly. You can collaborate and refer to previous messages easily.",
  },
  {
    question: "What are tokens and how do they work?",
    answer: "Tokens are credits used to interact with the AI. Each message consumes a few tokens. You receive 50,000 tokens when you sign up.",
  },
  {
    question: "Can I export my conversations?",
    answer: "Yes, you’ll soon be able to export your chat history from the workspace. This feature is currently in beta.",
  },
  {
    question: "What happens when I run out of tokens?",
    answer: "You won’t be able to generate new responses. You can contact support to request more or wait for a recharge event.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    document.title = "Help Center | bolt.new";
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-semibold mb-4">Help Center</h1>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          Got questions? We’ve got answers.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b dark:border-zinc-700 pb-4 cursor-pointer transition-all"
            >
              <div
                onClick={() => toggleFAQ(index)}
                className="flex items-center justify-between"
              >
                <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
                  {faq.question}
                </h2>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                )}
              </div>
              {openIndex === index && (
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-medium mb-2">Still need help?</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Reach out to us at{" "}
            <a
              href="mailto:support@weblitz.new"
              className="text-blue-500 underline"
            >
              support@weblitz.new
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
