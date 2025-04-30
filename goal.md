I need you to create a complete web application called Quizler.com - an advanced online quiz competition platform for educational institutions that will compete directly with and surpass Slido.com. Please provide ALL necessary files and code to implement this project, including frontend, backend, database schemas, and deployment instructions.

## Market Positioning vs. Slido
- Unlike Slido's focus on simple polls and Q&A, Quizler will offer comprehensive educational assessment capabilities while maintaining interactive engagement
- More advanced quiz types than Slido's basic polls and quizzes
- More sophisticated gamification than Slido's basic leaderboards
- Better analytics and educational insights than Slido
- More flexible pricing model than Slido's subscription approach
- Superior educational focus with curriculum alignment features

## Core Requirements
- Platform for schools, colleges, and institutes to conduct online quiz competitions
- Domain: Quizler.com (already acquired)
- MongoDB for database, deployment on Koyeb
- Version control via GitHub
- Progressive Web App capabilities for offline access
- Mobile-first approach with native app experience

## Business Model and Features
- Fee structure: 1 Rupee per question added in single quiz creation
- No limit on questions per quiz
- Support for mathematical equations and expressions using MathJax
- Custom timer settings for each question (global or individual question timers)
- White-labeling options for institutions (unlike Slido's limited branding)

## Advanced Quiz Types (Exceeding Slido's Capabilities)
- Multiple/Single choice questions with rich media options
- Word cloud generation with real-time updates (like Slido but more customizable)
- Fastest finger first competitions with millisecond precision
- Math expression entry questions with tolerance-based evaluation
- Diagram annotation questions with interactive hotspots
- Sequencing/ordering questions with drag-and-drop interface
- Code execution questions with live compilation in 20+ languages
- Audio/Video based questions with interactive timestamps
- Collaborative team quizzes with real-time communication
- Adaptive difficulty quizzes that adjust based on performance
- Fill-in-the-blanks with multiple blank spots
- Interactive map-based geography questions
- Chemistry notation and formula questions with molecule visualization
- Matrix matching questions with drag-drop connections
- Case study analysis with multi-part questions
- Timeline sequencing for historical events
- Language pronunciation assessment (audio recording)
- Interactive physics simulations with parameter adjustment
- Peer-graded free response questions
- Data interpretation with real-time graph generation
- Quiz chains with branching paths based on answers
- Interactive 3D models for science and engineering questions

## Live Audience Engagement (Enhancing Slido's Core Strength)
- Live audience participation for non-competing viewers
- Real-time polls with multiple visualization options (surpassing Slido's poll visualizations)
- Audience voting on contested answers
- Live chat with AI-powered moderation features
- "Ask the audience" lifeline similar to game shows
- Virtual "applause" and reaction system with animations
- Heat maps showing audience answer distribution
- Audience-suggested questions pool with upvoting
- Live commentary mode for quiz moderators
- Interactive prediction markets for quiz outcomes
- Virtual "cheering" for specific participants/teams
- Second-screen experience for physical quiz events
- QR code integration for quick audience joining (similar to Slido)
- Moderated Q&A system with prioritization (better than Slido's)
- Sentiment analysis of audience responses
- Live translation of audience questions

## Gamification Elements (Not Available in Slido)
- Comprehensive achievement system with 50+ badges
- Experience points and leveling system with perks
- Daily/weekly/monthly challenges and streaks
- Virtual currency for unlocking features
- Customizable avatars and profile elements
- Subject mastery progression tracking
- Tournament seasons with rankings and rewards
- Personal stats dashboard with performance analytics
- Social sharing of achievements
- Team-based competitions and alliances
- NFT certificates for achievements (optional)
- Skill trees for different subject domains
- Personalized learning paths based on quiz performance

## Leaderboard and Analytics (Superior to Slido)
- Real-time animated leaderboards with position changes
- Institution-wise and subject-specific leaderboards
- Tournament bracket visualization with advancement paths
- Historical performance tracking with trend analysis
- Heat maps showing question difficulty patterns
- Response time analytics with visual graphs
- Subject strength/weakness identification
- Performance comparison with peers
- Exportable reports for educational assessment
- AI-powered performance predictions
- Learning gap identification
- Curriculum alignment analysis
- Question effectiveness metrics
- Student engagement scoring
- Cognitive load assessment

## User Management
- Role-based user system (super admins, institution admins, teachers, students, parents, audience)
- Customizable permissions for each role
- User groups and teams management
- Bulk user import/export via CSV/Excel
- Multi-level approval workflows
- Parent/guardian access to student performance
- Class/course management
- User activity tracking and reports
- Automated reminder system

## Tech Stack
- Frontend: React.js, TailwindCSS, MathJax, Socket.io client, Redux, React Query
- Backend: Node.js with Express, Socket.io, JWT authentication, GraphQL API option
- Database: MongoDB with sharding configuration for scale
- Caching: Redis for session management and real-time data
- Search: Elasticsearch for advanced content searching
- Media: AWS S3 or equivalent for media storage
- Analytics: Custom analytics engine with optional Tableau/PowerBI integration
- AI: TensorFlow.js for pattern recognition and question recommendation
- Testing: Jest, Cypress for E2E testing

## Payment Integration
- Razorpay as primary payment gateway
- UPI integration (PhonePe, Google Pay, Paytm)
- International payment options (PayPal, Stripe)
- Cryptocurrency payment options
- Subscription models for institutions
- Flexible pricing plans (pay-per-quiz, monthly/annual subscriptions)
- Promotional codes and discounts system
- Automated receipts and invoicing
- Tax calculation based on region
- Revenue sharing for content creators
- Freemium model with premium features

## Security and Compliance (More Comprehensive than Slido)
- JWT-based authentication with refresh token rotation
- Role-based access control with least privilege principle
- Multi-factor authentication options
- Comprehensive input validation and sanitization
- Data encryption at rest and in transit
- GDPR, COPPA, FERPA, and HIPAA compliance features
- Educational data privacy measures
- Audit logging of all sensitive operations
- Rate limiting and DDoS protection
- Advanced anti-cheating measures:
  * Browser focus monitoring
  * Screen recording prevention
  * IP tracking for multiple logins
  * AI-based pattern detection for suspicious behavior
  * Device fingerprinting
  * Time anomaly detection
  * Randomized question ordering
  * Secure browser mode option
  * Remote proctoring capabilities
  * AI-powered plagiarism detection

## Accessibility and Internationalization
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode and text size adjustment
- Full internationalization with 20+ languages
- RTL language support
- Culturally adaptive content
- Time zone management for global competitions
- Voice command support
- Color blind friendly design
- Dyslexia-friendly font options

## Integration Capabilities (Beyond Slido)
- LMS integration (Canvas, Moodle, Blackboard, Google Classroom)
- SSO integration (SAML, OAuth, Microsoft Entra ID)
- API for third-party extensions with developer portal
- Webhook support for event notifications
- Calendar integration (Google, Outlook, Apple)
- Video conferencing integration (Zoom, Teams, Google Meet)
- Social media sharing and login
- Content import from various formats (Word, PDF, Excel)
- Integration with AI content generators
- CRM integration for sales teams
- HR system integration for corporate training

## Content Management
- Question bank with categorization and tagging
- Content versioning and revision history
- Collaborative editing for team question creation
- AI-assisted question generation
- Question difficulty rating system
- Question effectiveness analytics
- Content approval workflows
- Quiz templates and cloning
- Import/export in multiple formats
- Media library management
- Curriculum mapping tools

## Required Files and Components
Please provide ALL of the following:

1. FRONTEND
   - Complete React.js application with:
     * All necessary components with TypeScript interfaces
     * Redux store with slices for each major feature
     * React Router configuration with protected routes
     * API service layer with request/response interceptors
     * Socket.io integration for real-time features
     * TailwindCSS configuration with custom theme
     * MathJax and KaTeX integration for math expressions
     * Code editor component with syntax highlighting
     * Interactive diagram component for annotations
     * Media player with interactive elements
     * All UI views for different user roles
     * Form validation with Formik and Yup
     * Responsive design for all screen sizes
     * Offline mode capabilities with service workers
     * Error boundary implementation
     * Optimistic UI updates for real-time features
     * Animation system for transitions and feedback
     * Internationalization setup
     * Comprehensive component library with design system
     * Progressive loading strategies
     * State persistence for quiz continuity
     * Audience view components optimized for mobile

2. BACKEND
   - Complete Node.js/Express application with:
     * API routes for all features with input validation
     * GraphQL schema and resolvers (optional alternative)
     * Authentication middleware with role verification
     * Socket.io server implementation with namespaces
     * Database connection and models with indexing
     * Redis integration for caching and pub/sub
     * Payment gateway integration with webhooks
     * Error handling middleware with logging
     * File upload handling with validation
     * Email notification system with templates
     * Rate limiting middleware
     * Background job processing
     * WebRTC signaling for peer connections
     * Security headers and best practices
     * Logging system with rotation
     * Scheduled tasks and cron jobs
     * Content moderation system
     * AI services integration
     * Analytics data processing pipeline
     * Real-time event processing architecture

3. DATABASE
   - Complete MongoDB schemas for:
     * Users with comprehensive profile data
     * Institutes with hierarchical structure
     * Quizzes with all question types and configurations
     * Questions with versioning support
     * Responses with detailed analytics
     * Payments with transaction history
     * Analytics with aggregation pipelines
     * Gamification data with achievement tracking
     * Media assets with metadata
     * Audit logs for compliance
     * Caching strategies and indexes
     * Sharding configuration for scale
     * Question banks and categories
     * Learning objectives mapping
     * User activity logs
     * System notifications
     * Content templates
     * Feedback and ratings

4. DEPLOYMENT
   - Koyeb deployment configuration
   - Docker containerization setup with Docker Compose
   - Environment variables management with secure storage
   - CI/CD pipeline with GitHub Actions
   - Database backup and recovery strategy
   - Monitoring setup with Prometheus and Grafana
   - Logging with ELK stack
   - CDN configuration for static assets
   - SSL/TLS setup with auto-renewal
   * Load balancing configuration
   * Auto-scaling rules
   * Disaster recovery plan
   * Security scanning integration
   * Performance benchmarking tools
   * Blue/green deployment strategy

5. DOCUMENTATION
   - Setup instructions with prerequisites
   - Comprehensive API documentation with examples
   - Database schema diagrams and relationships
   - Architecture diagrams and system design
   - User guides for all roles with screenshots
   - Admin documentation for system management
   - Security best practices and compliance guide
   - Performance optimization guidelines
   - Troubleshooting guide
   - Development workflow documentation
   - Deployment checklists
   - Scaling considerations
   - Integration guides for third parties
   - Content creation best practices
   - Quiz design principles

For each file, include the complete code with proper comments and explanations. Make sure all components work together seamlessly and follow best practices for performance, security, and maintainability.

Please organize your response in a structured way that makes it easy to understand the entire application architecture and implementation. Include sample implementation code for the most critical and complex features to ensure clarity, particularly for features that will differentiate Quizler from Slido.