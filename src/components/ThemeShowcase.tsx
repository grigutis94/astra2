import React from 'react';
import Button from './ui/Button';
import Logo from './Logo';

const ThemeShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-light p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header with Logo */}
        <header className="text-center card p-8">
          <Logo size="xl" className="mb-6 justify-center" />
          <h1 className="text-4xl font-bold text-neutral-dark mb-4">
            Astra LT Design System
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            A comprehensive design system featuring the official Astra LT brand colors 
            and components for professional tank configuration applications.
          </p>
        </header>

        {/* Color Palette */}
        <section className="card p-8">
          <h2 className="text-3xl font-bold text-neutral-dark mb-8">Brand Colors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Primary Blue */}
            <div className="text-center">
              <div className="w-full h-24 bg-primary-blue rounded-lg mb-3 shadow-astra-md"></div>
              <h3 className="font-semibold text-neutral-dark">Primary Blue</h3>
              <p className="text-sm text-neutral-dark-600">#0057B8</p>
              <p className="text-xs text-neutral-dark-500 mt-1">Buttons, Links, Headers</p>
            </div>
            
            {/* Accent Orange */}
            <div className="text-center">
              <div className="w-full h-24 bg-accent-orange rounded-lg mb-3 shadow-astra-md"></div>
              <h3 className="font-semibold text-neutral-dark">Accent Orange</h3>
              <p className="text-sm text-neutral-dark-600">#F28C00</p>
              <p className="text-xs text-neutral-dark-500 mt-1">CTAs, Highlights</p>
            </div>
            
            {/* Neutral Dark */}
            <div className="text-center">
              <div className="w-full h-24 bg-neutral-dark rounded-lg mb-3 shadow-astra-md"></div>
              <h3 className="font-semibold text-neutral-dark">Neutral Dark</h3>
              <p className="text-sm text-neutral-dark-600">#333333</p>
              <p className="text-xs text-neutral-dark-500 mt-1">Text, Navigation</p>
            </div>
            
            {/* Neutral Light */}
            <div className="text-center">
              <div className="w-full h-24 bg-neutral-light border-2 border-neutral-dark-200 rounded-lg mb-3 shadow-astra-md"></div>
              <h3 className="font-semibold text-neutral-dark">Neutral Light</h3>
              <p className="text-sm text-neutral-dark-600">#F5F5F5</p>
              <p className="text-xs text-neutral-dark-500 mt-1">Backgrounds</p>
            </div>
            
            {/* Highlight Green */}
            <div className="text-center">
              <div className="w-full h-24 bg-highlight-green rounded-lg mb-3 shadow-astra-md"></div>
              <h3 className="font-semibold text-neutral-dark">Highlight Green</h3>
              <p className="text-sm text-neutral-dark-600">#00A34A</p>
              <p className="text-xs text-neutral-dark-500 mt-1">Success, Badges</p>
            </div>
          </div>
        </section>

        {/* Button Variants */}
        <section className="bg-white rounded-2xl p-8 shadow-astra-lg">
          <h2 className="text-3xl font-bold text-neutral-dark mb-8">Button Components</h2>
          
          <div className="space-y-8">
            {/* Button Variants */}
            <div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" label="Primary Button" />
                <Button variant="secondary" label="Secondary Button" />
                <Button variant="accent" label="Accent Button" />
                <Button variant="success" label="Success Button" />
                <Button variant="outline" label="Outline Button" />
              </div>
            </div>
            
            {/* Button Sizes */}
            <div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm" label="Small" />
                <Button variant="primary" size="md" label="Medium" />
                <Button variant="primary" size="lg" label="Large" />
              </div>
            </div>
            
            {/* Disabled State */}
            <div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-4">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" label="Normal" />
                <Button variant="primary" label="Disabled" disabled />
              </div>
            </div>
          </div>
        </section>

        {/* Alerts and Badges */}
        <section className="bg-white rounded-2xl p-8 shadow-astra-lg">
          <h2 className="text-3xl font-bold text-neutral-dark mb-8">Alerts & Badges</h2>
          
          <div className="space-y-6">
            {/* Alerts */}
            <div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-4">Alert Messages</h3>
              <div className="space-y-4">
                <div className="alert alert-success">
                  <strong>Success!</strong> Tank configuration has been saved successfully.
                </div>
                <div className="alert alert-warning">
                  <strong>Warning!</strong> Please review the selected dimensions before proceeding.
                </div>
                <div className="alert alert-error">
                  <strong>Error!</strong> Invalid input detected. Please check your entries.
                </div>
                <div className="alert alert-info">
                  <strong>Info!</strong> New features are available in the latest update.
                </div>
              </div>
            </div>
            
            {/* Badges */}
            <div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-4">Status Badges</h3>
              <div className="flex flex-wrap gap-3">
                <span className="badge badge-success">Completed</span>
                <span className="badge badge-warning">In Progress</span>
                <span className="badge badge-error">Failed</span>
                <span className="badge badge-info">Draft</span>
              </div>
            </div>
          </div>
        </section>

        {/* Forms */}
        <section className="bg-white rounded-2xl p-8 shadow-astra-lg">
          <h2 className="text-3xl font-bold text-neutral-dark mb-8">Form Components</h2>
          
          <div className="max-w-md space-y-6">
            <div>
              <label className="form-label">Tank Height</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="Enter height in mm"
              />
            </div>
            
            <div>
              <label className="form-label">Tank Type</label>
              <select className="form-input">
                <option>Select tank type</option>
                <option>Cylindrical</option>
                <option>Rectangular</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Description</label>
              <textarea 
                className="form-input" 
                rows={3}
                placeholder="Enter tank description..."
              ></textarea>
            </div>
            
            <div className="flex gap-3">
              <Button variant="primary" label="Save Configuration" />
              <Button variant="outline" label="Cancel" />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="bg-white rounded-2xl p-8 shadow-astra-lg">
          <h2 className="text-3xl font-bold text-neutral-dark mb-8">Card Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-neutral-dark">Cylindrical Tank</h3>
              </div>
              <div className="card-body">
                <p className="text-neutral-dark-600">
                  Standard cylindrical tank configuration with customizable dimensions 
                  and accessories.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="badge badge-info">Available</span>
                  <span className="badge badge-success">Popular</span>
                </div>
              </div>
              <div className="card-footer">
                <Button variant="primary" size="sm" label="Configure" />
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-neutral-dark">Rectangular Tank</h3>
              </div>
              <div className="card-body">
                <p className="text-neutral-dark-600">
                  Rectangular tank design suitable for space-constrained installations
                  and specialized applications.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="badge badge-info">Available</span>
                </div>
              </div>
              <div className="card-footer">
                <Button variant="primary" size="sm" label="Configure" />
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-neutral-dark">Custom Solution</h3>
              </div>
              <div className="card-body">
                <p className="text-neutral-dark-600">
                  Need something specific? Contact our engineering team for 
                  custom tank solutions.
                </p>
                <div className="mt-4">
                  <span className="badge badge-warning">Contact Required</span>
                </div>
              </div>
              <div className="card-footer">
                <Button variant="accent" size="sm" label="Contact Us" />
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="bg-white rounded-2xl p-8 shadow-astra-lg">
          <h2 className="text-3xl font-bold text-neutral-dark mb-8">Typography</h2>
          
          <div className="space-y-6">
            <div>
              <h1>Heading 1 - Main Page Title</h1>
              <h2>Heading 2 - Section Title</h2>
              <h3>Heading 3 - Subsection Title</h3>
              <h4>Heading 4 - Component Title</h4>
              <h5>Heading 5 - Small Title</h5>
              <h6>Heading 6 - Caption</h6>
            </div>
            
            <div>
              <p className="text-lg text-neutral-dark">
                Large paragraph text for important information and introductions.
              </p>
              <p className="text-base text-neutral-dark">
                Regular paragraph text for body content and descriptions.
              </p>
              <p className="text-sm text-neutral-dark-600">
                Small text for captions, notes, and secondary information.
              </p>
            </div>
            
            <div>
              <a href="#" className="text-primary-blue hover:text-primary-blue-hover">
                This is a link with hover effect
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center bg-white rounded-2xl p-8 shadow-astra-lg">
          <Logo size="md" className="mb-4 justify-center" />
          <p className="text-neutral-dark-600">
            © 2025 Astra LT. Professional tank configuration solutions.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ThemeShowcase;
