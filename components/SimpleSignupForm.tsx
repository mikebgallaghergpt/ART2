// SimpleSignupForm.tsx - Lightweight fallback version
// Basic signup form without complex animations or heavy dependencies

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function SimpleSignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interests: [] as string[],
    newsletter: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple demo mode - just save to localStorage
    setTimeout(() => {
      const userData = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      const existingUsers = JSON.parse(localStorage.getItem('gallagher_demo_users') || '[]');
      existingUsers.push(userData);
      localStorage.setItem('gallagher_demo_users', JSON.stringify(existingUsers));
      
      setSuccess(true);
      setIsLoading(false);
    }, 1000);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-green-700 mb-2">Welcome to Gallagher Art School!</h2>
          <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
          <Button onClick={() => window.location.reload()}>
            Sign Up Another Student
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Join Gallagher Art School</CardTitle>
        <p className="text-sm text-gray-600">Expert instruction from an MFA Yale graduate</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label>Areas of Interest (select all that apply)</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {['Drawing', 'Painting', 'Sculpture', 'Mixed Media AI & Collage', 'Color Theory'].map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, interests: [...formData.interests, interest]});
                      } else {
                        setFormData({...formData, interests: formData.interests.filter(i => i !== interest)});
                      }
                    }}
                    className="rounded"
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="newsletter"
              checked={formData.newsletter}
              onChange={(e) => setFormData({...formData, newsletter: e.target.checked})}
              className="rounded"
            />
            <Label htmlFor="newsletter" className="text-sm">
              Subscribe to our newsletter for art tips and class updates
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Join Art School'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}