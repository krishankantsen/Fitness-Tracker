'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useGymEntries } from '@/hooks/useGymEntries';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function GymTracker() {
  const [reason, setReason] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const { saveEntry } = useGymEntries();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayFormatted = format(new Date(), 'EEEE, MMMM do');

  const handleSubmit = async () => {
    if (selectedResponse === null) return;

    setSaving(true);
    const success = await saveEntry(today, selectedResponse, reason);
    
    if (success) {
      setReason('');
      setSelectedResponse(null);
    }
    
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Did you go to the gym today?
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {todayFormatted}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setSelectedResponse(true)}
              variant={selectedResponse === true ? "default" : "outline"}
              size="lg"
              className={`h-20 text-lg font-semibold transition-all duration-200 ${
                selectedResponse === true
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg scale-105'
                  : 'hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Yes, I did!
            </Button>

            <Button
              onClick={() => setSelectedResponse(false)}
              variant={selectedResponse === false ? "default" : "outline"}
              size="lg"
              className={`h-20 text-lg font-semibold transition-all duration-200 ${
                selectedResponse === false
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg scale-105'
                  : 'hover:border-red-300 hover:bg-red-50'
              }`}
            >
              <XCircle className="w-6 h-6 mr-2" />
              No, I didn't
            </Button>
          </div>

          {selectedResponse !== null && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                  {selectedResponse ? 'What did you work on?' : 'What prevented you from going?'}
                </Label>
                <Textarea
                  id="reason"
                  placeholder={
                    selectedResponse
                      ? 'e.g., Upper body strength training, cardio workout...'
                      : 'e.g., Too tired, work got busy, feeling unwell...'
                  }
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {saving ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}