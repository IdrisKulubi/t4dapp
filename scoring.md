# InCountryYouthADAPT Challenge 2025 - Scoring System Plan

## Executive Summary

This document outlines a comprehensive scoring system for the InCountryYouthADAPT Challenge 2025, designed to efficiently handle large volumes of applications while providing an intuitive evaluation experience for judges and jury members.

## Process Flow

```
Application Submission → Eligibility Check → Application Review → Shortlisting → Scoring Phase → Dragon's Den Event
```

### Phase 1: Application Collection (Current)
- Public application form accessible to all eligible applicants
- Automatic eligibility validation (age, country, business registration status)
- Applications stored in secure database

### Phase 2: Administrative Review & Shortlisting
- Admin panel for reviewing all submitted applications
- Bulk operations for efficient processing
- Shortlisting criteria and tools
- Automated notifications to shortlisted candidates

### Phase 3: Scoring Phase (New Implementation)
- **Access Control**: Only shortlisted applicants proceed to scoring
- **Time-gated Access**: Scoring opens only when Dragon's Den preparation begins
- **Multi-level Evaluation**: Technical review → Jury scoring → Final ranking

### Phase 4: Dragon's Den Event
- Final presentation platform
- Real-time scoring during presentations
- Winner selection and announcement

## User Roles & Permissions

### 1. Applicants
- **Public Phase**: Submit applications, view application status
- **Shortlisted Phase**: Access to detailed feedback, preparation materials
- **Dragon's Den Phase**: Access to presentation guidelines and schedule

### 2. Administrators
- **Application Management**: View, filter, export all applications
- **Shortlisting Tools**: Bulk selection, notification management
- **System Configuration**: Scoring criteria setup, phase management
- **Reporting**: Analytics, progress tracking, data export

### 3. Technical Reviewers
- **Limited Access**: Only shortlisted applications
- **Focused Review**: Technical feasibility, innovation assessment
- **Scoring Interface**: Streamlined evaluation forms
- **Collaboration Tools**: Comments, flagging, discussion threads

### 4. Jury Members
- **Secure Access**: Role-based authentication with 2FA
- **Evaluation Dashboard**: Assigned applications with scoring interface
- **Scoring Tools**: Weighted criteria, comparative ranking
- **Progress Tracking**: Individual and panel progress visibility

### 5. Dragon's Den Judges
- **Real-time Scoring**: Live presentation evaluation
- **Historical Access**: Previous scores and technical reviews
- **Final Decision**: Winner selection tools

## Technical Architecture

### Database Schema Extensions

```sql
-- Application Status Management
ALTER TABLE applications ADD COLUMN status ENUM(
  'submitted',
  'under_review', 
  'shortlisted',
  'scoring_phase',
  'dragons_den',
  'finalist',
  'rejected'
) DEFAULT 'submitted';

-- Scoring Tables
CREATE TABLE scoring_criteria (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  weight DECIMAL(3,2) NOT NULL, -- e.g., 0.25 for 25%
  max_score INT DEFAULT 10,
  category ENUM('technical', 'business', 'impact', 'presentation'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  criteria_id INT NOT NULL,
  evaluator_id INT NOT NULL,
  evaluator_type ENUM('technical_reviewer', 'jury_member', 'dragons_den_judge'),
  score DECIMAL(4,2) NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id),
  FOREIGN KEY (criteria_id) REFERENCES scoring_criteria(id),
  UNIQUE KEY unique_score (application_id, criteria_id, evaluator_id)
);

CREATE TABLE evaluator_assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  evaluator_id INT NOT NULL,
  evaluator_type ENUM('technical_reviewer', 'jury_member'),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id)
);

CREATE TABLE scoring_phases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  allowed_roles JSON, -- ['technical_reviewer', 'jury_member']
  description TEXT
);
```

### Authentication & Authorization

```typescript
// Enhanced user roles
export enum UserRole {
  APPLICANT = 'applicant',
  ADMIN = 'admin',
  TECHNICAL_REVIEWER = 'technical_reviewer',
  JURY_MEMBER = 'jury_member',
  DRAGONS_DEN_JUDGE = 'dragons_den_judge'
}

// Permission system
export const PERMISSIONS = {
  VIEW_ALL_APPLICATIONS: ['admin'],
  VIEW_SHORTLISTED_APPLICATIONS: ['admin', 'technical_reviewer', 'jury_member'],
  SCORE_APPLICATIONS: ['technical_reviewer', 'jury_member', 'dragons_den_judge'],
  MANAGE_SCORING_PHASES: ['admin'],
  EXPORT_DATA: ['admin'],
  ASSIGN_EVALUATORS: ['admin']
} as const;
```

## Scoring Criteria Framework

### Technical Review (Weight: 30%)
1. **Innovation & Originality** (Max: 10 points)
   - Uniqueness of solution
   - Novel approach to climate adaptation
   - Competitive advantage

2. **Technical Feasibility** (Max: 10 points)
   - Technology readiness level
   - Implementation complexity
   - Resource requirements

3. **Scalability Potential** (Max: 10 points)
   - Market expansion possibilities
   - Technology scalability
   - Resource scalability

### Business Viability (Weight: 25%)
1. **Market Opportunity** (Max: 10 points)
   - Market size and growth
   - Target customer validation
   - Revenue potential

2. **Business Model** (Max: 10 points)
   - Revenue stream clarity
   - Financial sustainability
   - Path to profitability

3. **Team Capability** (Max: 10 points)
   - Relevant experience
   - Skills assessment
   - Execution capability

### Climate Impact (Weight: 30%)
1. **Adaptation Benefits** (Max: 10 points)
   - Direct climate adaptation value
   - Measurable impact metrics
   - Beneficiary reach

2. **Environmental Sustainability** (Max: 10 points)
   - Environmental footprint
   - Circular economy principles
   - Long-term sustainability

3. **Social Impact** (Max: 10 points)
   - Community benefits
   - Job creation potential
   - Gender and youth inclusion

### Presentation & Communication (Weight: 15%)
1. **Clarity of Vision** (Max: 10 points)
   - Problem articulation
   - Solution presentation
   - Impact communication

2. **Presentation Skills** (Max: 10 points)
   - Communication effectiveness
   - Q&A handling
   - Professional delivery

## User Interface Design

### 1. Admin Dashboard
```
📊 Applications Overview
├── Total Applications: 1,247
├── Pending Review: 892
├── Shortlisted: 125
├── In Scoring: 75
└── Finalists: 25

🔧 Quick Actions
├── Bulk Shortlist
├── Assign Evaluators
├── Export Data
├── Manage Phases
└── Send Notifications

📈 Analytics
├── Applications by Country
├── Scoring Progress
├── Evaluator Performance
└── Timeline Tracking
```

### 2. Evaluator Dashboard
```
🎯 My Assignments (12 applications)
├── Pending Review: 8
├── In Progress: 3
├── Completed: 1
└── Deadline: 5 days remaining

📋 Current Application: TechSol Kenya
├── Application Details
├── Scoring Form
├── Previous Comments
├── Technical Documents
└── Submit Score

🏆 Leaderboard (Anonymous)
├── Top 10 Applications
├── Average Scores
├── Consensus Level
└── My Progress vs Others
```

### 3. Scoring Interface
```
Application: [Business Name] - [Country]

Tabs:
📄 Application Details | 📊 Scoring Form | 💬 Comments | 📎 Documents

Scoring Form:
┌─ Technical Review (30%) ─────────────────────┐
│ Innovation & Originality    [●●●●●○○○○○] 5/10 │
│ Technical Feasibility       [●●●●●●●○○○] 7/10 │  
│ Scalability Potential       [●●●●●●○○○○] 6/10 │
│ Subtotal: 18/30 (60%)                        │
└───────────────────────────────────────────────┘

┌─ Business Viability (25%) ──────────────────┐
│ Market Opportunity          [●●●●●●●●○○] 8/10 │
│ Business Model              [●●●●●●○○○○] 6/10 │
│ Team Capability             [●●●●●●●○○○] 7/10 │
│ Subtotal: 21/30 (70%)                       │
└──────────────────────────────────────────────┘

Comments: [Rich text editor with templates]
□ Flag for Discussion
□ Recommend for Fast Track
□ Request Additional Information

[Save Draft] [Submit Score] [Reset Form]
```

## Security & Access Control

### 1. Time-based Access Control
```typescript
export class ScoringAccessControl {
  static canAccessScoring(userRole: UserRole, phase: ScoringPhase): boolean {
    const now = new Date();
    const phaseActive = now >= phase.start_date && now <= phase.end_date;
    const roleAllowed = phase.allowed_roles.includes(userRole);
    
    return phaseActive && roleAllowed && phase.is_active;
  }
  
  static getAccessibleApplications(userId: number, userRole: UserRole): Application[] {
    switch (userRole) {
      case UserRole.ADMIN:
        return getAllApplications();
      case UserRole.TECHNICAL_REVIEWER:
      case UserRole.JURY_MEMBER:
        return getAssignedApplications(userId);
      case UserRole.APPLICANT:
        return getUserOwnApplication(userId);
      default:
        return [];
    }
  }
}
```

### 2. Data Protection
- **Anonymization**: Remove personally identifiable information during scoring
- **Audit Trails**: Log all scoring activities
- **Backup Systems**: Regular database backups
- **Encryption**: Encrypt sensitive data at rest and in transit

## Implementation Strategy

### Phase 1: Foundation (Week 1-2)
- [ ] Database schema migration
- [ ] User role system implementation
- [ ] Basic admin dashboard
- [ ] Application status management

### Phase 2: Scoring Infrastructure (Week 3-4)
- [ ] Scoring criteria configuration
- [ ] Evaluator assignment system
- [ ] Basic scoring interface
- [ ] Progress tracking

### Phase 3: Advanced Features (Week 5-6)
- [ ] Advanced filtering and search
- [ ] Bulk operations
- [ ] Analytics dashboard
- [ ] Notification system

### Phase 4: Testing & Optimization (Week 7-8)
- [ ] Load testing with sample data
- [ ] User acceptance testing
- [ ] Performance optimization
- [ ] Security audit

### Phase 5: Deployment & Training (Week 9-10)
- [ ] Production deployment
- [ ] User training materials
- [ ] Judge onboarding
- [ ] System monitoring setup

## Performance Optimization

### 1. Database Optimization
```sql
-- Indexing strategy
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_scores_application_evaluator ON application_scores(application_id, evaluator_id);
CREATE INDEX idx_assignments_evaluator ON evaluator_assignments(evaluator_id, evaluator_type);

-- Materialized views for analytics
CREATE VIEW scoring_summary AS
SELECT 
  a.id,
  a.business_name,
  a.country,
  AVG(s.score) as average_score,
  COUNT(s.id) as total_scores,
  MAX(s.updated_at) as last_updated
FROM applications a
LEFT JOIN application_scores s ON a.id = s.application_id
WHERE a.status IN ('scoring_phase', 'dragons_den')
GROUP BY a.id;
```

### 2. Caching Strategy
- **Redis**: Cache frequently accessed application data
- **CDN**: Static assets and document files
- **Database Query Caching**: Expensive aggregation queries
- **Session Management**: Secure session storage

### 3. Load Balancing
- **Application Servers**: Multiple server instances
- **Database Read Replicas**: Distribute read operations
- **File Storage**: Distributed file system for documents

## Monitoring & Analytics

### 1. Key Metrics
- Applications processed per hour
- Average scoring time per application
- Evaluator engagement rates
- System response times
- Error rates and types

### 2. Dashboards
- **Real-time**: Current system status and active users
- **Progress**: Scoring completion rates by phase
- **Quality**: Inter-rater reliability and consensus metrics
- **Performance**: System performance and optimization opportunities

## Risk Management

### 1. Technical Risks
- **High Load**: Implement auto-scaling and load balancing
- **Data Loss**: Regular backups and disaster recovery procedures
- **Security Breaches**: Multi-layer security and monitoring
- **System Downtime**: Redundancy and failover mechanisms

### 2. Process Risks
- **Evaluator Bias**: Anonymous scoring and calibration sessions
- **Inconsistent Scoring**: Clear rubrics and training materials
- **Timeline Delays**: Buffer time and parallel processing
- **Quality Issues**: Review mechanisms and quality checks

## Success Metrics

### 1. Efficiency Metrics
- Time to complete application review: < 2 weeks
- Average scoring time per application: < 45 minutes
- System uptime: > 99.5%
- User satisfaction score: > 4.5/5

### 2. Quality Metrics
- Inter-rater reliability: > 0.8
- Score distribution normality
- Evaluator engagement rate: > 90%
- Appeal rate: < 5%

## Conclusion

This scoring system is designed to be robust, scalable, and user-friendly while maintaining the highest standards of fairness and security. The phased implementation approach ensures smooth deployment while allowing for iterative improvements based on user feedback and system performance.

The system will transform the evaluation process from a manual, time-consuming task to an efficient, transparent, and data-driven process that can handle the expected large volume of high-quality applications for the InCountryYouthADAPT Challenge 2025.
