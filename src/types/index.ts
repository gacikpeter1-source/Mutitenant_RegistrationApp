export interface User {
  uid: string
  email: string
  name: string
  phone: string
  description?: string
  photoURL?: string
  role: 'trainer' | 'admin' | 'assistant' | 'superadmin'
  status: 'pending' | 'approved' | 'rejected'
  tenantId?: string // Optional for superadmin (no tenant), required for others
  createdAt: Date
  permissions?: {
    viewCalendar?: boolean
    checkAttendance?: boolean
    addWalkIns?: boolean
    viewFullParticipantDetails?: boolean
  }
}

// Multi-trainer event system
export interface TrainerSlot {
  trainerId: string
  trainerName: string
  trainerPhoto?: string
  capacity: number // -1 = unlimited
  currentCount: number
  description?: string
  joinedAt: Date
}

export interface Event {
  id: string
  title: string
  type: string
  date: Date
  startTime: string // "14:00" format
  duration: number // minutes
  tenantId: string // NEW: Tenant segregation
  
  // Multi-trainer support
  trainers: { [trainerId: string]: TrainerSlot }
  
  // Legacy support (for migration)
  trainerId?: string
  trainerName?: string
  capacity?: number | null
  attendees?: Attendee[]
  waitlist?: Attendee[]
  
  // Recurring events
  recurringSeriesId?: string
  recurrencePattern?: 'daily' | 'weekly' | 'monthly' | null
  recurringDays?: number[] // For weekly: 0=Sun, 1=Mon, etc.
  
  // Organizational events (imported from Excel)
  isOrganizational?: boolean
  importedBy?: string
  importedAt?: Date
  status?: 'pending' | 'active' // pending until first trainer confirms
  
  // Attendance tracking (for assistants)
  attendanceStats?: {
    totalRegistered: number
    checkedIn: number
    noShows: number
    walkIns: number
    attendanceRate: number
    lastUpdated: Date
  }
  
  createdBy: string
  createdAt: Date
  updatedAt?: Date // Optional since not all events have it
}

export interface Attendee {
  id: string
  name: string
  email: string
  phone: string
  bookedAt: Date
}

export interface InviteCode {
  id: string
  code: string
  tenantId: string // NEW: Invite codes are tenant-specific
  createdBy: string
  createdAt: Date
  used: boolean
  usedBy?: string
  usedAt?: Date
}

export interface AppSettings {
  backgroundImageUrl?: string
  trainingTypes: string[]
  tenantId: string // NEW: Settings are tenant-specific
}

export interface Registration {
  id: string
  eventId: string
  trainerId: string
  tenantId: string // NEW: Tenant segregation
  userId: string // generated unique ID
  
  // User data
  name: string
  email: string
  phone: string
  
  // Generated data
  uniqueCode: string // 6-digit format "203-776"
  qrCodeData: string // encoded QR data
  
  // Cancellation token (for email link cancellation)
  cancellationToken: string // 32-char secure token
  tokenExpiresAt: Date // token expires after 14 days
  
  // Organizational event link
  isOrganizationalEvent?: boolean
  
  // Attendance tracking (for assistants)
  attendance?: {
    checkedIn: boolean
    checkedInAt?: Date
    checkedInBy?: string
    noShow: boolean
  }
  
  // Status
  status: 'confirmed' | 'waitlist' | 'cancelled'
  position?: number // waitlist position
  registeredAt: Date
}

export interface WalkIn {
  id: string
  eventId: string
  trainerId?: string // For multi-trainer events
  tenantId: string // NEW: Tenant segregation
  name: string
  notes?: string
  checkedInAt: Date
  addedBy: string // Assistant who added them
}

export interface Booking {
  id: string
  eventId: string
  tenantId: string // NEW: Tenant segregation
  name: string
  email: string
  phone: string
  status: 'confirmed' | 'waitlist'
  position?: number // position in waitlist
  createdAt: Date
}

export interface Statistics {
  totalTrainings: number
  totalBookings: number
  activeTrainers: number
  trainingsByTrainer: { [trainerId: string]: number }
  bookingsByMonth: { [month: string]: number }
}
