import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, FileText, BarChart3, Shield, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';

const LandingPage = () => {
  const { state } = useAppContext();
  const [currentNews, setCurrentNews] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % state.news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [state.news.length]);

  const nextNews = () => {
    setCurrentNews((prev) => (prev + 1) % state.news.length);
  };

  const prevNews = () => {
    setCurrentNews((prev) => (prev - 1 + state.news.length) % state.news.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Intern Management System
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Complete Intern Management System connecting administrators and interns 
              for seamless collaboration and growth tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Link to="/admin-login">Admin Login</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 font-semibold">
                <Link to="/intern-login">Intern Login</Link>
              </Button>
            </div>
          </div>
          <div className="lg:order-last">
            <img 
              src="/hero-image.jpg" 
              alt="Professional team working with InternHive system"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Modern Internship Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage interns effectively, track performance, 
              and ensure successful outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Intern Management</CardTitle>
                <CardDescription>
                  Comprehensive intern profiles, skills tracking, and assignment management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Task Assignment</CardTitle>
                <CardDescription>
                  Create, assign, and track tasks with deadlines and progress monitoring
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Detailed performance tracking with ratings, feedback, and progress reports
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Secure file sharing, assignment submissions, and resource management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Attendance Tracking</CardTitle>
                <CardDescription>
                  Real-time attendance monitoring with check-in/out and reporting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>
                  Instant notifications and live dashboard updates for all activities
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Updates</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed about the newest features and improvements to InternHive
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateX(-${currentNews * 100}%)` }}>
                {state.news.map((item, index) => (
                  <div key={item.id} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="text-sm text-primary font-semibold mb-2">{item.date}</div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {item.description}
                        </p>
                        <Button variant="outline" className="w-fit">
                          Read More
                        </Button>
                      </div>
                      <div className="relative h-64 md:h-auto">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevNews}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextNews}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {state.news.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentNews(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentNews ? 'bg-primary' : 'bg-primary/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already using InternHive to manage 
            their internship programs effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/admin-signup">Create Admin Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/intern-signup">Register as Intern</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">InternHive</h3>
              <p className="text-primary-foreground/80">
                The complete solution for modern internship management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link to="/admin-login" className="hover:text-primary-foreground">Admin Portal</Link></li>
                <li><Link to="/intern-login" className="hover:text-primary-foreground">Intern Portal</Link></li>
                <li><Link to="/database-schema" className="hover:text-primary-foreground">Database Schema</Link></li>
                <li><Link to="/admin-signup" className="hover:text-primary-foreground">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-primary-foreground/80">
                Email: support@internhive.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 InternHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
