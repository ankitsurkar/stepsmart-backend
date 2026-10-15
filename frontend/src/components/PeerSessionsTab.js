import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  X, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getOpenPeerSessions, 
  getMyPeerSessions, 
  createPeerSession, 
  bookPeerSession, 
  cancelPeerSession 
} from '../utils/api';

const PRESET_TOPICS = [
  'Mock Product Sense Interview',
  'Metrics & Estimation Practice',
  'Weekly Assignment Review',
  'System Design & Tech Case',
  'Resume & Portfolio Discussion'
];

// Generate 30-min interval times throughout 24 hours, ordered from 6 AM to midnight then early morning
const TIME_SLOTS = [];
for (let hour = 6; hour < 24; hour++) {
  for (let min = 0; min < 60; min += 30) {
    const hh = String(hour).padStart(2, '0');
    const mm = String(min).padStart(2, '0');
    const val = `${hh}:${mm}`;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayH = hour % 12 === 0 ? 12 : hour % 12;
    TIME_SLOTS.push({ value: val, label: `${displayH}:${mm} ${period}` });
  }
}
for (let hour = 0; hour < 6; hour++) {
  for (let min = 0; min < 60; min += 30) {
    const hh = String(hour).padStart(2, '0');
    const mm = String(min).padStart(2, '0');
    const val = `${hh}:${mm}`;
    const displayH = hour === 0 ? 12 : hour;
    TIME_SLOTS.push({ value: val, label: `${displayH}:${mm} AM` });
  }
}

const DURATION_CHOICES = [15, 30, 45, 60, 90];

export default function PeerSessionsTab({ courseId, courseTitle, qaLesson, currentUserId }) {
  const [activeTab, setActiveTab] = useState('peer'); // 'peer' | 'mentor'
  const [openSlots, setOpenSlots] = useState([]);
  const [myOffered, setMyOffered] = useState([]);
  const [myBooked, setMyBooked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null); // { type: 'connect', slot } | { type: 'cancel', sessionId, isHost, status, title }

  // Form State
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [formDate, setFormDate] = useState(tomorrow);
  const [formTime, setFormTime] = useState('18:00');
  const [formDuration, setFormDuration] = useState(45);
  const [formTopic, setFormTopic] = useState('Mock Product Sense Interview');
  const [formNotes, setFormNotes] = useState('');
  const [formCustomUrl, setFormCustomUrl] = useState('');

  const loadSessions = useCallback(async (isSilent = false) => {
    if (!courseId) return;
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const [openRes, myRes] = await Promise.all([
        getOpenPeerSessions(courseId),
        getMyPeerSessions(courseId),
      ]);

      setOpenSlots(openRes.data?.sessions || []);
      setMyOffered(myRes.data?.offered || []);
      setMyBooked(myRes.data?.booked || []);
    } catch (err) {
      console.error('Failed to load peer sessions:', err);
      if (!isSilent) toast.error('Could not load peer study sessions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!formDate || !formTime) {
      toast.error('Please choose a valid date and start time.');
      return;
    }

    const scheduledStart = new Date(`${formDate}T${formTime}:00`);
    if (isNaN(scheduledStart.getTime())) {
      toast.error('Invalid date or time selected.');
      return;
    }

    if (scheduledStart.getTime() <= Date.now() + 60000) {
      toast.error('Please select a future time slot.');
      return;
    }

    const scheduledEnd = new Date(scheduledStart.getTime() + formDuration * 60 * 1000);

    setSubmitting(true);
    try {
      await createPeerSession(courseId, {
        scheduledStartTime: scheduledStart.toISOString(),
        scheduledEndTime: scheduledEnd.toISOString(),
        topic: formTopic.trim() || 'General Discussion & Study',
        notes: formNotes.trim(),
        customMeetingUrl: formCustomUrl.trim() || undefined,
      });

      toast.success('Study slot created! Classmates can now connect with you.');
      setIsModalOpen(false);
      setFormNotes('');
      setFormCustomUrl('');
      await loadSessions(true);
    } catch (err) {
      console.error('Error creating study slot:', err);
      toast.error(err.response?.data?.message || 'Failed to create slot.');
    } finally {
      setSubmitting(false);
    }
  };

  const executeBookSlot = async (sessionId) => {
    setActionId(sessionId);
    try {
      const res = await bookPeerSession(courseId, sessionId);
      toast.success(res.data?.message || 'Connected successfully! See details in My Sessions.');
      setConfirmModal(null);
      await loadSessions(true);
    } catch (err) {
      console.error('Error booking slot:', err);
      toast.error(err.response?.data?.message || 'Failed to connect. The slot might already be taken.');
      setConfirmModal(null);
      await loadSessions(true);
    } finally {
      setActionId(null);
    }
  };

  const executeCancel = async (sessionId, isHost, status) => {
    setActionId(sessionId);
    try {
      const res = await cancelPeerSession(courseId, sessionId);
      toast.success(res.data?.message || 'Session updated.');
      setConfirmModal(null);
      await loadSessions(true);
    } catch (err) {
      console.error('Error canceling session:', err);
      toast.error(err.response?.data?.message || 'Failed to update session.');
      setConfirmModal(null);
    } finally {
      setActionId(null);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  // Filter available slots: strictly exclude caller's own slots
  const availableClassmateSlots = openSlots.filter(s => !s.isMySlot && (!currentUserId || s.hostUserId !== currentUserId));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      
      {/* ── Top Tabs Switcher (Native LMS Style) ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('peer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.25rem',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              border: activeTab === 'peer' ? '1px solid var(--primary, #188ab2)' : '1px solid rgba(15, 40, 80, 0.12)',
              background: activeTab === 'peer' ? 'var(--primary, #188ab2)' : 'rgba(255, 255, 255, 0.8)',
              color: activeTab === 'peer' ? '#ffffff' : 'var(--muted-foreground, #64748b)',
              boxShadow: activeTab === 'peer' ? '0 4px 14px rgba(24, 138, 178, 0.28)' : 'none',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={16} />
            Peer-to-Peer Study
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mentor')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.25rem',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              border: activeTab === 'mentor' ? '1px solid var(--primary, #188ab2)' : '1px solid rgba(15, 40, 80, 0.12)',
              background: activeTab === 'mentor' ? 'var(--primary, #188ab2)' : 'rgba(255, 255, 255, 0.8)',
              color: activeTab === 'mentor' ? '#ffffff' : 'var(--muted-foreground, #64748b)',
              boxShadow: activeTab === 'mentor' ? '0 4px 14px rgba(24, 138, 178, 0.28)' : 'none',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.15s ease'
            }}
          >
            <Clock size={16} />
            1:1 Mentor Office Hours
          </button>
        </div>

        {activeTab === 'peer' && (
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => loadSessions(true)}
              disabled={refreshing}
              title="Refresh slots"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                background: '#ffffff',
                border: '1px solid rgba(15, 40, 80, 0.12)',
                borderRadius: '12px',
                cursor: 'pointer',
                color: '#64748b',
                boxShadow: '0 2px 6px rgba(15, 40, 80, 0.04)',
                transition: 'all 0.15s ease'
              }}
            >
              <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--primary, #188ab2)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.65rem 1.2rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(24, 138, 178, 0.28)',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={16} />
              Offer a Study Slot
            </button>
          </div>
        )}
      </div>

      {/* ── TAB 1: PEER-TO-PEER STUDY ── */}
      {activeTab === 'peer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Banner Card (Soft Gradient LMS Style) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(24, 138, 178, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%)',
            border: '1px solid rgba(24, 138, 178, 0.18)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 10px 28px rgba(15, 40, 80, 0.06)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  background: 'rgba(24, 138, 178, 0.12)',
                  color: '#0f6f8f',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em'
                }}>
                  PEER LEARNING
                </span>
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--foreground, #0f172a)' }}>
                  Practice & Learn with Cohort Classmates
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground, #64748b)', maxWidth: '680px', lineHeight: 1.5 }}>
                Connect 1-on-1 for mock product interviews, assignment brainstorms, or topic revisions. A private zero-setup video meeting link is created instantly once matched.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(24, 138, 178, 0.3)',
                padding: '0.65rem 1.15rem',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#0f6f8f',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(24, 138, 178, 0.08)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              + Create Your Slot
            </button>
          </div>

          {/* Section: My Scheduled Sessions (Offered or Matched) */}
          {(myBooked.length > 0 || myOffered.length > 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="#188ab2" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--foreground, #0f172a)' }}>
                  My Scheduled Sessions ({myBooked.length + myOffered.length})
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {/* Booked Sessions */}
                {myBooked.map((session) => (
                  <div key={session.sessionId} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(15, 40, 80, 0.08)',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    boxShadow: '0 8px 24px rgba(15, 40, 80, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.12)',
                          color: '#059669',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          Matched with {session.hostName || 'Classmate'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setConfirmModal({
                            type: 'cancel',
                            sessionId: session.sessionId,
                            isHost: false,
                            status: session.status,
                            title: 'Leave Study Session?'
                          })}
                          disabled={actionId === session.sessionId}
                          title="Leave session"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '3px 6px',
                            borderRadius: '6px'
                          }}
                        >
                          <Trash2 size={13} /> Leave
                        </button>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--foreground, #0f172a)', marginBottom: '6px' }}>
                        {session.topic}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: '#64748b', marginBottom: '6px' }}>
                        <Calendar size={14} color="#188ab2" />
                        <span>{formatDateTime(session.scheduledStartTime)}</span>
                      </div>

                      {session.hostEmail && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          Host Email: <span style={{ fontWeight: 500, color: '#334155' }}>{session.hostEmail}</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'var(--primary, #188ab2)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '9px 14px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(24, 138, 178, 0.22)',
                        transition: 'opacity 0.15s ease'
                      }}
                    >
                      <Video size={16} /> Join Video Room <ExternalLink size={14} />
                    </a>
                  </div>
                ))}

                {/* My Offered Slots */}
                {myOffered.map((session) => {
                  const isBooked = session.status === 'BOOKED';
                  return (
                    <div key={session.sessionId} style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(15, 40, 80, 0.08)',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      boxShadow: '0 8px 24px rgba(15, 40, 80, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{
                            background: isBooked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                            color: isBooked ? '#059669' : '#d97706',
                            padding: '3px 9px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {isBooked ? `Booked by ${session.peerName || 'Student'}` : 'Open (Waiting for peer)'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setConfirmModal({
                              type: 'cancel',
                              sessionId: session.sessionId,
                              isHost: true,
                              status: session.status,
                              title: session.status === 'OPEN' ? 'Remove Study Slot?' : 'Cancel Study Session?'
                            })}
                            disabled={actionId === session.sessionId}
                            title="Cancel slot"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '3px 6px',
                              borderRadius: '6px'
                            }}
                          >
                            <Trash2 size={13} /> {isBooked ? 'Cancel' : 'Delete'}
                          </button>
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--foreground, #0f172a)', marginBottom: '6px' }}>
                          {session.topic}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: '#64748b', marginBottom: '6px' }}>
                          <Calendar size={14} color="#188ab2" />
                          <span>{formatDateTime(session.scheduledStartTime)}</span>
                        </div>

                        {isBooked && session.peerEmail && (
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Peer Email: <span style={{ fontWeight: 500, color: '#334155' }}>{session.peerEmail}</span>
                          </div>
                        )}
                      </div>

                      {isBooked ? (
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            background: 'var(--primary, #188ab2)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '9px 14px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(24, 138, 178, 0.22)'
                          }}
                        >
                          <Video size={16} /> Join Video Room <ExternalLink size={14} />
                        </a>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          Video room will activate once a peer books this slot.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Available Open Slots from Classmates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#188ab2" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--foreground, #0f172a)' }}>
                Available Classmate Slots ({availableClassmateSlots.length})
              </h3>
            </div>

            {loading ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(15, 40, 80, 0.08)',
                borderRadius: '18px',
                padding: '2.5rem',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(15, 40, 80, 0.05)',
                color: '#64748b'
              }}>
                Loading open slots...
              </div>
            ) : availableClassmateSlots.length === 0 ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px dashed rgba(15, 40, 80, 0.16)',
                borderRadius: '18px',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'rgba(24, 138, 178, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={24} color="#188ab2" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--foreground, #0f172a)' }}>
                  No open study slots right now
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', maxWidth: '420px', lineHeight: 1.5 }}>
                  Be the first to offer a study slot! Select a time that works for you, and your classmates can join with a single click.
                </p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    marginTop: '0.4rem',
                    background: 'var(--primary, #188ab2)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.65rem 1.25rem',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(24, 138, 178, 0.28)'
                  }}
                >
                  + Offer a Study Slot
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {availableClassmateSlots.map((slot) => (
                  <div key={slot.sessionId} style={{
                    background: '#ffffff',
                    border: '1px solid rgba(15, 40, 80, 0.08)',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    boxShadow: '0 8px 24px rgba(15, 40, 80, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}>
                    <div>
                      {/* Host Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'rgba(24, 138, 178, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: '#0f6f8f'
                        }}>
                          {slot.hostName ? slot.hostName.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground, #0f172a)' }}>
                            {slot.hostName || 'Classmate'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Course Peer
                          </div>
                        </div>
                      </div>

                      {/* Topic */}
                      <div style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--foreground, #0f172a)',
                        marginBottom: '8px',
                        lineHeight: 1.35
                      }}>
                        {slot.topic}
                      </div>

                      {/* Date & Time */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '0.825rem',
                        fontWeight: 500,
                        color: '#334155',
                        marginBottom: '8px'
                      }}>
                        <Calendar size={14} color="#188ab2" />
                        <span>{formatDateTime(slot.scheduledStartTime)}</span>
                      </div>

                      {/* Notes / Agenda */}
                      {slot.notes && (
                        <p style={{
                          fontSize: '0.825rem',
                          color: '#64748b',
                          margin: 0,
                          lineHeight: 1.45,
                          background: '#f8fafc',
                          borderLeft: '3px solid #188ab2',
                          padding: '6px 10px',
                          borderRadius: '0 6px 6px 0'
                        }}>
                          "{slot.notes}"
                        </p>
                      )}
                    </div>

                    {/* Connect Button */}
                    <button
                      type="button"
                      onClick={() => setConfirmModal({
                        type: 'connect',
                        sessionId: slot.sessionId,
                        hostName: slot.hostName || 'Classmate',
                        topic: slot.topic,
                        time: slot.scheduledStartTime
                      })}
                      disabled={actionId === slot.sessionId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'var(--primary, #188ab2)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(24, 138, 178, 0.25)',
                        transition: 'opacity 0.15s ease'
                      }}
                    >
                      <Users size={16} />
                      {actionId === slot.sessionId ? 'Connecting...' : 'Connect & Join Slot'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: 1:1 MENTOR OFFICE HOURS (Preserves Existing System) ── */}
      {activeTab === 'mentor' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(15, 40, 80, 0.08)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 28px rgba(15, 40, 80, 0.06)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div>
            <span style={{
              background: 'rgba(24, 138, 178, 0.1)',
              color: '#0f6f8f',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              OFFICE HOURS
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground, #0f172a)', margin: '8px 0 4px 0' }}>
              1:1 Mentor Scheduling
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
              Book office hours with instructors and mentors to review assignments, resolve doubts, and receive personalized feedback.
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(15, 40, 80, 0.06)', margin: '4px 0' }} />

          {qaLesson?.qaLink ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>
                Your mentoring calendar booking link is currently available:
              </div>
              <a
                href={qaLesson.qaLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--primary, #188ab2)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '11px 22px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(24, 138, 178, 0.28)'
                }}
              >
                <Calendar size={17} /> Open Q&amp;A Booking Calendar <ExternalLink size={15} />
              </a>
            </div>
          ) : (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem',
              color: '#64748b',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={20} color="#94a3b8" />
              <span>No mentor scheduling link is available yet for your completed lessons. Mentoring slots open as you complete modules.</span>
            </div>
          )}
        </div>
      )}

      {/* ── CREATE STUDY SLOT MODAL (Clean LMS SaaS Style) ── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(15, 40, 80, 0.1)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 50px -12px rgba(15, 40, 80, 0.25)',
            padding: '1.75rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{
                  background: 'rgba(24, 138, 178, 0.1)',
                  color: '#0f6f8f',
                  padding: '3px 9px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  NEW STUDY SLOT
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.15rem', fontWeight: 700, color: 'var(--foreground, #0f172a)' }}>
                  Offer a Peer Study Slot
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  color: '#64748b'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              {/* Topic */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Discussion Topic / Focus *
                </label>
                <input
                  type="text"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="e.g. Mock Product Sense Interview"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
                {/* Topic quick presets */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {PRESET_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setFormTopic(topic)}
                      style={{
                        background: formTopic === topic ? 'rgba(24, 138, 178, 0.15)' : '#f1f5f9',
                        border: formTopic === topic ? '1px solid var(--primary, #188ab2)' : '1px solid #e2e8f0',
                        borderRadius: '999px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        color: formTopic === topic ? '#0f6f8f' : '#64748b'
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                    Start Time *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 36px 10px 12px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#0f172a',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    <div style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#64748b'
                    }}>
                      <Clock size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration Pills */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Duration
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {DURATION_CHOICES.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setFormDuration(mins)}
                      style={{
                        flex: 1,
                        minWidth: '55px',
                        padding: '9px 10px',
                        border: formDuration === mins ? '1.5px solid var(--primary, #188ab2)' : '1px solid #cbd5e1',
                        borderRadius: '10px',
                        background: formDuration === mins ? 'var(--primary, #188ab2)' : '#ffffff',
                        color: formDuration === mins ? '#ffffff' : '#475569',
                        fontWeight: 600,
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        boxShadow: formDuration === mins ? '0 3px 10px rgba(24, 138, 178, 0.28)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                  Agenda / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. 20m case question, 15m mutual feedback."
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Custom Video Link */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '4px' }}>
                  Custom Video Room URL (Optional)
                </label>
                <input
                  type="url"
                  value={formCustomUrl}
                  onChange={(e) => setFormCustomUrl(e.target.value)}
                  placeholder="https://meet.google.com/... (optional)"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                  Leave empty to automatically generate a private zero-setup StepSmart video room.
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: 'var(--primary, #188ab2)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(24, 138, 178, 0.28)'
                  }}
                >
                  {submitting ? 'Creating Slot...' : 'Create Study Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── IN-APP CONFIRMATION MODAL (Replaces browser popups) ── */}
      {confirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.75rem',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 24px 48px rgba(15, 40, 80, 0.18)',
            border: '1px solid rgba(15, 40, 80, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            animation: 'fadeIn 0.15s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: confirmModal.type === 'connect' ? 'rgba(24, 138, 178, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: confirmModal.type === 'connect' ? '#188ab2' : '#ef4444'
                }}>
                  {confirmModal.type === 'connect' ? <Users size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    {confirmModal.type === 'connect' ? 'Confirm Study Connection' : confirmModal.title || 'Cancel Session?'}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {confirmModal.type === 'connect' ? 'Connect with your cohort classmate' : 'Action cannot be undone'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                disabled={actionId !== null}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {confirmModal.type === 'connect' ? (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ color: '#64748b' }}>Host:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{confirmModal.hostName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ color: '#64748b' }}>Topic:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', textAlign: 'right', maxWidth: '240px' }}>{confirmModal.topic}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ color: '#64748b' }}>Time:</span>
                  <span style={{ fontWeight: 600, color: '#188ab2' }}>{formatDateTime(confirmModal.time)}</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>
                  Once connected, a private video meeting room will be activated for both of you and confirmation emails will be sent.
                </p>
              </div>
            ) : (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '14px',
                padding: '1rem',
                fontSize: '0.85rem',
                color: '#991b1b',
                lineHeight: 1.5
              }}>
                {confirmModal.isHost 
                  ? (confirmModal.status === 'OPEN' 
                      ? 'This open study slot will be deleted and removed from the cohort feed.' 
                      : 'This scheduled session will be cancelled and your peer will be notified.') 
                  : 'You will leave this study session. The slot will reopen for other students to connect.'}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                disabled={actionId !== null}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.type === 'connect') {
                    executeBookSlot(confirmModal.sessionId);
                  } else {
                    executeCancel(confirmModal.sessionId, confirmModal.isHost, confirmModal.status);
                  }
                }}
                disabled={actionId !== null}
                style={{
                  background: confirmModal.type === 'connect' ? 'var(--primary, #188ab2)' : '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: confirmModal.type === 'connect' 
                    ? '0 4px 14px rgba(24, 138, 178, 0.28)' 
                    : '0 4px 14px rgba(239, 68, 68, 0.28)'
                }}
              >
                {actionId !== null 
                  ? 'Processing...' 
                  : (confirmModal.type === 'connect' ? 'Confirm & Connect' : 'Yes, Proceed')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
