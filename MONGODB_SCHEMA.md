# MongoDB Schema: Complete Data Model

## Collections Overview

```
MindBridge AI Database Structure

┌─────────────────────────────────────────────────────────┐
│                      MongoDB Collections                 │
├─────────────────────────────────────────────────────────┤
│  ├─ users             (All users - Patients & Doctors)   │
│  ├─ patients          (Patient profiles)                 │
│  ├─ doctors           (Doctor profiles)                  │
│  ├─ appointments      (Booking records)                  │
│  ├─ chatsessions      (Chat messages during call)        │
│  ├─ videosessions     (Video call metadata)              │
│  └─ assessments       (Patient assessment data)          │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Users Collection

**Purpose**: Store all users (Patients & Doctors)

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  firstName: "Alice",
  lastName: "Johnson",
  email: "alice@example.com",
  passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lm",
  role: "patient",           // "patient" or "doctor"
  profilePicture: "https://...",
  isActive: true,
  createdAt: ISODate("2024-02-01T10:00:00Z"),
  updatedAt: ISODate("2024-02-25T15:30:00Z")
}
```

**Index**: 
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```

---

## 2. Patients Collection

**Purpose**: Patient-specific data

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"),  // Reference to users
  dateOfBirth: ISODate("1990-05-15T00:00:00Z"),
  gender: "Female",
  medicalHistory: [
    {
      condition: "Anxiety Disorder",
      diagnosedDate: ISODate("2022-01-10T00:00:00Z"),
      status: "ongoing"
    },
    {
      condition: "Sleep Disorder",
      diagnosedDate: ISODate("2023-06-20T00:00:00Z"),
      status: "ongoing"
    }
  ],
  allergies: ["Penicillin"],
  currentMedications: ["Sertraline 50mg"],
  emergencyContact: {
    name: "John Johnson",
    relationship: "Brother",
    phoneNumber: "+1-555-0001"
  },
  preferredDoctor: ObjectId("507f1f77bcf86cd799439099"),  // Optional
  createdAt: ISODate("2024-02-01T10:00:00Z"),
  updatedAt: ISODate("2024-02-25T15:30:00Z")
}
```

---

## 3. Doctors Collection

**Purpose**: Doctor-specific data and credentials

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439099"),
  userId: ObjectId("507f1f77bcf86cd799439098"),  // Reference to users
  licenseNumber: "MED-2020-12345",
  specialization: "Psychotherapy",
  subspecialties: ["Anxiety", "Sleep Disorders", "Depression"],
  yearsOfExperience: 8,
  education: [
    {
      degree: "MD",
      institution: "Harvard Medical School",
      graduatedYear: 2016
    },
    {
      degree: "Specialization in Psychiatry",
      institution: "Massachusetts General Hospital",
      graduatedYear: 2019
    }
  ],
  certifications: [
    "Licensed Medical Doctor",
    "Certified Therapist",
    "CPR Certified"
  ],
  officeLocation: {
    address: "123 Main St, Suite 100",
    city: "Boston",
    state: "MA",
    zipCode: "02101",
    coordinates: { latitude: 42.3601, longitude: -71.0589 }
  },
  hourlyRate: 150,
  bio: "Specializing in anxiety and sleep disorders with 8+ years experience.",
  ratings: {
    averageRating: 4.8,
    totalReviews: 45,
    reviews: [
      {
        patientId: ObjectId("507f1f77bcf86cd799439011"),
        rating: 5,
        reviewText: "Excellent therapist, very helpful",
        createdAt: ISODate("2024-01-15T10:00:00Z")
      }
    ]
  },
  availability: {
    monday: [
      { startTime: "09:00", endTime: "17:00" }
    ],
    tuesday: [
      { startTime: "09:00", endTime: "17:00" }
    ],
    wednesday: [
      { startTime: "13:00", endTime: "21:00" }
    ],
    thursday: [
      { startTime: "09:00", endTime: "17:00" }
    ],
    friday: [
      { startTime: "09:00", endTime: "17:00" }
    ],
    saturday: [],
    sunday: []
  },
  isVerified: true,
  isActive: true,
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-02-25T15:30:00Z")
}
```

---

## 4. Appointments Collection

**Purpose**: Store appointment bookings between patients and doctors

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439050"),
  patientId: ObjectId("507f1f77bcf86cd799439011"),      // Alice
  doctorId: ObjectId("507f1f77bcf86cd799439099"),       // Dr. Bob
  appointmentDate: ISODate("2024-02-27T15:00:00Z"),
  duration: 30,                                          // minutes
  status: "confirmed",  // "pending", "confirmed", "completed", "cancelled"
  
  // Video call information
  videoSessionId: ObjectId("507f1f77bcf86cd799439150"), // Links to VideoSession
  
  // Chat information
  chatSessionId: ObjectId("507f1f77bcf86cd799439160"),  // Links to ChatSession
  
  // Cancellation info
  cancelledBy: null,
  cancellationReason: null,
  cancelledAt: null,
  
  // Notes
  patientNotes: "Having trouble sleeping, anxiety about work",
  doctorNotes: null,                                      // Added after call
  
  // Payment (optional)
  paymentStatus: "pending",  // "pending", "completed"
  amount: 150,               // Based on doctor's hourly rate
  
  // Timestamps
  createdAt: ISODate("2024-02-25T10:00:00Z"),
  updatedAt: ISODate("2024-02-25T15:30:00Z")
}
```

**Indexes**:
```javascript
db.appointments.createIndex({ patientId: 1, appointmentDate: 1 })
db.appointments.createIndex({ doctorId: 1, appointmentDate: 1 })
db.appointments.createIndex({ videoSessionId: 1 })
db.appointments.createIndex({ chatSessionId: 1 })
```

---

## 5. ChatSessions Collection

**Purpose**: Store chat messages during consultation

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439160"),
  appointmentId: ObjectId("507f1f77bcf86cd799439050"),
  patientId: ObjectId("507f1f77bcf86cd799439011"),
  doctorId: ObjectId("507f1f77bcf86cd799439099"),
  
  status: "active",  // "active", "completed", "archived"
  
  messages: [
    {
      _id: ObjectId("507f1f77bcf86cd799439161"),
      senderId: ObjectId("507f1f77bcf86cd799439011"),  // Alice
      senderRole: "patient",
      message: "Hi Dr. Bob, thanks for taking the time today",
      timestamp: ISODate("2024-02-27T15:05:00Z"),
      isRead: true,
      readAt: ISODate("2024-02-27T15:06:00Z")
    },
    {
      _id: ObjectId("507f1f77bcf86cd799439162"),
      senderId: ObjectId("507f1f77bcf86cd799439099"),  // Dr. Bob
      senderRole: "doctor",
      message: "You're welcome! Let's discuss your sleep issues",
      timestamp: ISODate("2024-02-27T15:06:00Z"),
      isRead: true,
      readAt: ISODate("2024-02-27T15:06:30Z")
    },
    {
      _id: ObjectId("507f1f77bcf86cd799439163"),
      senderId: ObjectId("507f1f77bcf86cd799439011"),
      senderRole: "patient",
      message: "I've been having trouble falling asleep for 3 weeks",
      timestamp: ISODate("2024-02-27T15:07:00Z"),
      isRead: true,
      readAt: ISODate("2024-02-27T15:08:00Z")
    }
  ],
  
  messageCount: 3,
  lastMessage: {
    senderId: ObjectId("507f1f77bcf86cd799439011"),
    text: "I've been having trouble falling asleep for 3 weeks",
    timestamp: ISODate("2024-02-27T15:07:00Z")
  },
  
  // AI Summary (generated after call)
  summaryGenerated: true,
  summary: {
    mainTopics: ["Sleep disorders", "Anxiety management", "Lifestyle factors"],
    keyPoints: [
      "Patient experiencing insomnia for 3 weeks",
      "Associated with work-related stress and anxiety",
      "Previous sleep hygiene attempted without success",
      "Interested in non-pharmaceutical approaches"
    ],
    recommendations: [
      "Cognitive Behavioral Therapy for Insomnia (CBT-I)",
      "Progressive muscle relaxation exercises",
      "Sleep diary tracking for 2 weeks",
      "Follow-up appointment in 2 weeks"
    ],
    clinicalNotes: "Patient presents with acute insomnia secondary to anxiety...",
    nextSteps: "Schedule follow-up in 2 weeks, provide CBT-I resources"
  },
  summarizedAt: ISODate("2024-02-27T15:35:00Z"),
  
  startedAt: ISODate("2024-02-27T15:00:00Z"),
  endedAt: ISODate("2024-02-27T15:35:00Z"),
  duration: 35,  // minutes
  
  createdAt: ISODate("2024-02-27T15:00:00Z"),
  updatedAt: ISODate("2024-02-27T15:35:00Z")
}
```

**Indexes**:
```javascript
db.chatsessions.createIndex({ appointmentId: 1 })
db.chatsessions.createIndex({ patientId: 1, doctorId: 1 })
```

---

## 6. VideoSessions Collection

**Purpose**: Store video call metadata and statistics

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439150"),
  appointmentId: ObjectId("507f1f77bcf86cd799439050"),
  patientId: ObjectId("507f1f77bcf86cd799439011"),
  doctorId: ObjectId("507f1f77bcf86cd799439099"),
  
  status: "completed",  // "initiated", "active", "completed", "failed"
  
  // Connection details
  connectionType: "p2p",  // "p2p" or "relay" (via TURN)
  iceServersUsed: [
    "stun:stun.l.google.com:19302",
    "turn:openrelay.metered.ca:80"
  ],
  
  // Media details
  mediaStreams: {
    patient: {
      videoCodec: "VP8",
      audioCodec: "OPUS",
      resolution: "1280x720",
      framerate: 30
    },
    doctor: {
      videoCodec: "VP8",
      audioCodec: "OPUS",
      resolution: "1280x720",
      framerate: 30
    }
  },
  
  // Connection quality
  quality: {
    patientBandwidth: {
      upload: 2500,  // kbps
      download: 3000
    },
    doctorBandwidth: {
      upload: 2400,
      download: 3100
    },
    averageLatency: 45,  // ms
    packetLoss: 0.2     // percentage
  },
  
  // Timestamps
  initiatedAt: ISODate("2024-02-27T15:00:00Z"),
  startedAt: ISODate("2024-02-27T15:01:00Z"),  // After WebRTC connection
  endedAt: ISODate("2024-02-27T15:35:00Z"),
  duration: 34,  // minutes
  
  // Recording (optional)
  recordingEnabled: false,
  recordingUrl: null,
  
  // Disconnect reasons
  disconnections: [
    {
      timestamp: ISODate("2024-02-27T15:15:00Z"),
      reason: "Network interruption",
      duration: 5,  // seconds
      reconnected: true
    }
  ],
  
  // Metadata
  clientVersion: "1.0.0",
  browser: "Chrome 122.0.0.0",
  operatingSystem: "Windows 10",
  
  createdAt: ISODate("2024-02-27T15:00:00Z"),
  updatedAt: ISODate("2024-02-27T15:35:00Z")
}
```

---

## 7. Assessments Collection

**Purpose**: Store patient mental health assessments

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439200"),
  patientId: ObjectId("507f1f77bcf86cd799439011"),
  appointmentId: ObjectId("507f1f77bcf86cd799439050"),
  
  assessmentType: "PHQ-9",  // Depression screening
  
  questions: [
    {
      question: "Little interest or pleasure in doing things?",
      response: "Nearly every day",
      score: 3
    },
    {
      question: "Feeling down, depressed, or hopeless?",
      response: "More than half the days",
      score: 2
    }
  ],
  
  totalScore: 12,
  severity: "moderate",  // "minimal", "mild", "moderate", "severe"
  
  interpretation: "Moderate symptoms of depression",
  recommendations: [
    "Consider CBT therapy",
    "Discuss medication options",
    "Schedule follow-up in 1 week"
  ],
  
  completedAt: ISODate("2024-02-27T15:25:00Z"),
  createdAt: ISODate("2024-02-27T15:00:00Z"),
  updatedAt: ISODate("2024-02-27T15:25:00Z")
}
```

---

## Data Relationships Diagram

```
Users (Parent)
├── Patients (role: "patient")
│   └── Contains: age, medical history, allergies, medications
│
└── Doctors (role: "doctor")
    └── Contains: license, specialization, ratings, availability

Appointments (Junction)
├── Patient ID → Users.Patients
├── Doctor ID → Users.Doctors
├── Chat Session ID ↓
├── Video Session ID ↓
└── Status: pending → confirmed → completed

ChatSessions (Related)
├── Appointment ID
├── Messages array
├── AI Summary (generated by Gemini API)
└── Status: active → completed

VideoSessions (Related)
├── Appointment ID
├── Connection quality metrics
├── Media codecs & bandwidth
└── Status: initiated → active → completed
```

---

## Complete Flow Data Example

```
1. Alice signs up as PATIENT
   → users.insert({ name: "Alice", role: "patient", ... })
   → patients.insert({ userId: alice_id, dateOfBirth: ..., ... })

2. Bob signs up as DOCTOR
   → users.insert({ name: "Bob", role: "doctor", ... })
   → doctors.insert({ userId: bob_id, license: "MED-...", ... })

3. Alice finds Bob and books appointment
   → appointments.insert({
       patientId: alice_id,
       doctorId: bob_id,
       appointmentDate: 2024-02-27T15:00:00Z,
       status: "pending"
     })

4. Bob accepts appointment
   → appointments.updateOne(
       { _id: appt_id },
       { status: "confirmed" }
     )

5. Alice joins video call
   → Socket.io connects with JWT token
   → socket.emit('join_video', { videoSessionId: appt_id })
   → Backend creates video room: 'video_appt_id'

6. Bob joins video call
   → Socket.io connects
   → socket.emit('join_video')
   → WebRTC handshake begins (Offer → Answer → ICE)

7. During call
   → ChatSession created: chatsessions.insert({
       appointmentId: appt_id,
       messages: [...]
     })
   → VideoSession created: videosessions.insert({
       appointmentId: appt_id,
       connectionType: "p2p",
       quality: {...}
     })

8. Call ends
   → VideoSession.updateOne({ status: "completed", endedAt: now })
   → Gemini API processes chat messages
   → ChatSession.updateOne({ summary: {...} })
   → AI summary stored in database

9. Follow-up
   → Doctor can view: appointments, chatSessions, videoSessions
   → Patient can view: appointments, chatSessions, AI summaries
   → System can schedule reminders for next appointment
```

---

## Queries Used During Demo

### Find all appointments for a patient
```javascript
db.appointments.find({ patientId: alice_id })
```

### Get doctor's upcoming appointments
```javascript
db.appointments.find({
  doctorId: bob_id,
  appointmentDate: { $gte: now },
  status: "confirmed"
})
```

### Get chat summary for appointment
```javascript
db.chatsessions.findOne(
  { appointmentId: appt_id },
  { summary: 1, mainTopics: 1, recommendations: 1 }
)
```

### Get video quality metrics
```javascript
db.videosessions.findOne(
  { appointmentId: appt_id },
  { quality: 1, duration: 1, connectionType: 1 }
)
```

### Find doctor by specialization
```javascript
db.doctors.find({
  specialization: "Psychotherapy",
  isVerified: true,
  isActive: true
}).limit(10)
```

### Get patient's assessment history
```javascript
db.assessments.find({ patientId: alice_id })
  .sort({ completedAt: -1 })
  .limit(5)
```
