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
  HelpCircle,
  MessageSquare,
  UserCheck
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

    // Combine local date and time to ISO string
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

      toast.success('Study slot created! Classmates can now join.');
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

  const handleBookSlot = async (sessionId, hostName) => {
    if (!window.confirm(`Connect with ${hostName || 'your classmate'} for this study session?`)) {
      return;
    }

    setActionId(sessionId);
    try {
      const res = await bookPeerSession(courseId, sessionId);
      toast.success(res.data?.message || 'Connected successfully! See details in My Sessions.');
      await loadSessions(true);
    } catch (err) {
      console.error('Error booking slot:', err);
      toast.error(err.response?.data?.message || 'Failed to connect. The slot might already be taken.');
      await loadSessions(true);
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (sessionId, isHost, status) => {
    const confirmMsg = isHost 
      ? (status === 'OPEN' ? 'Remove this open slot?' : 'Cancel this scheduled study session with your peer?')
      : 'Leave this study session? The slot will reopen for other students.';

    if (!window.confirm(confirmMsg)) return;

    setActionId(sessionId);
    try {
      const res = await cancelPeerSession(courseId, sessionId);
      toast.success(res.data?.message || 'Session updated.');
      await loadSessions(true);
    } catch (err) {
      console.error('Error canceling session:', err);
      toast.error(err.response?.data?.message || 'Failed to update session.');
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

  // Filter available slots: exclude my own slots from open feed
  const availableClassmateSlots = openSlots.filter(s => s.hostUserId !== currentUserId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1100px' }}>
      
      {/* ── Top Tabs Switcher (Neobrutalism Style) ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{
          display: 'inline-flex',
          background: '#ffffff',
          border: '2px solid #111111',
          padding: '4px',
          borderRadius: '12px',
          boxShadow: '3px 3px 0px 0px #111111',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('peer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: activeTab === 'peer' ? '2px solid #111111' : '2px solid transparent',
              background: activeTab === 'peer' ? '#FACC15' : 'transparent',
              color: '#111111',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
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
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: activeTab === 'mentor' ? '2px solid #111111' : '2px solid transparent',
              background: activeTab === 'mentor' ? '#FACC15' : 'transparent',
              color: '#111111',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Clock size={16} />
            1:1 Mentor Office Hours
          </button>
        </div>

        {activeTab === 'peer' && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => loadSessions(true)}
              disabled={refreshing}
              title="Refresh sessions"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 12px',
                background: '#ffffff',
                border: '2px solid #111111',
                borderRadius: '10px',
                boxShadow: '3px 3px 0px 0px #111111',
                cursor: 'pointer',
                color: '#111111'
              }}
            >
              <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0f6f8f',
                color: '#ffffff',
                border: '2px solid #111111',
                borderRadius: '10px',
                padding: '9px 18px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px 0px #111111',
                transition: 'transform 0.1s ease'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              <Plus size={18} />
              Offer a Study Slot
            </button>
          </div>
        )}
      </div>

      {/* ── TAB 1: PEER-TO-PEER STUDY ── */}
      {activeTab === 'peer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Banner Card */}
          <div style={{
            background: '#FFF3A7',
            border: '2px solid #111111',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            boxShadow: '4px 4px 0px 0px #111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  background: '#111111',
                  color: '#FFF3A7',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  letterSpacing: '0.5px'
                }}>
                  PEER LEARNING
                </span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111111' }}>
                  Connect 1-on-1 with Your Classmates
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#333333', maxWidth: '680px', lineHeight: 1.5 }}>
                Select an open slot below to study together, practice mock interviews, or work on course assignments. An instant private video room will be ready for you both.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              style={{
                background: '#ffffff',
                border: '2px solid #111111',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.825rem',
                color: '#111111',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px 0px #111111',
                whiteSpace: 'nowrap'
              }}
            >
              + Create Your Own Slot
            </button>
          </div>

          {/* Section: My Sessions (Offered or Booked) */}
          {(myBooked.length > 0 || myOffered.length > 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="#0f6f8f" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#111111' }}>
                  My Scheduled Sessions ({myBooked.length + myOffered.length})
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {/* 1. Booked Sessions (where current user is peer or matched host) */}
                {myBooked.map((session) => (
                  <div key={session.sessionId} style={{
                    background: '#ffffff',
                    border: '2px solid #111111',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '3px 3px 0px 0px #111111',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{
                          background: '#D1FAE5',
                          border: '1.5px solid #111111',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: '#065f46'
                        }}>
                          MATCHED WITH {session.hostName?.toUpperCase() || 'CLASSMATE'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCancel(session.sessionId, false, session.status)}
                          disabled={actionId === session.sessionId}
                          title="Leave this session"
                          style={{
                            background: '#FEE2E2',
                            border: '1px solid #111111',
                            borderRadius: '6px',
                            padding: '4px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#991b1b',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          <Trash2 size={13} style={{ marginRight: '4px' }} /> Leave
                        </button>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111111', marginBottom: '6px' }}>
                        {session.topic}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: '#4b5563', marginBottom: '4px' }}>
                        <Calendar size={14} />
                        <span>{formatDateTime(session.scheduledStartTime)}</span>
                      </div>

                      {session.hostEmail && (
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '6px' }}>
                          Host Email: <span style={{ fontWeight: 600, color: '#111111' }}>{session.hostEmail}</span>
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
                        background: '#0f6f8f',
                        color: '#ffffff',
                        border: '2px solid #111111',
                        borderRadius: '8px',
                        padding: '9px 12px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        boxShadow: '2px 2px 0px 0px #111111'
                      }}
                    >
                      <Video size={16} /> Join Video Call <ExternalLink size={14} />
                    </a>
                  </div>
                ))}

                {/* 2. My Offered Slots */}
                {myOffered.map((session) => {
                  const isBooked = session.status === 'BOOKED';
                  return (
                    <div key={session.sessionId} style={{
                      background: '#ffffff',
                      border: '2px solid #111111',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      boxShadow: '3px 3px 0px 0px #111111',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span style={{
                            background: isBooked ? '#D1FAE5' : '#FEF3C7',
                            border: '1.5px solid #111111',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: isBooked ? '#065f46' : '#92400e'
                          }}>
                            {isBooked ? `BOOKED BY ${session.peerName?.toUpperCase() || 'STUDENT'}` : 'OPEN (WAITING FOR PEER)'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCancel(session.sessionId, true, session.status)}
                            disabled={actionId === session.sessionId}
                            title="Cancel slot"
                            style={{
                              background: '#FEE2E2',
                              border: '1px solid #111111',
                              borderRadius: '6px',
                              padding: '4px 6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#991b1b',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            <Trash2 size={13} style={{ marginRight: '4px' }} /> {isBooked ? 'Cancel' : 'Delete'}
                          </button>
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111111', marginBottom: '6px' }}>
                          {session.topic}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: '#4b5563', marginBottom: '4px' }}>
                          <Calendar size={14} />
                          <span>{formatDateTime(session.scheduledStartTime)}</span>
                        </div>

                        {isBooked && session.peerEmail && (
                          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '6px' }}>
                            Peer Email: <span style={{ fontWeight: 600, color: '#111111' }}>{session.peerEmail}</span>
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
                            background: '#0f6f8f',
                            color: '#ffffff',
                            border: '2px solid #111111',
                            borderRadius: '8px',
                            padding: '9px 12px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            boxShadow: '2px 2px 0px 0px #111111'
                          }}
                        >
                          <Video size={16} /> Join Video Call <ExternalLink size={14} />
                        </a>
                      ) : (
                        <div style={{ fontSize: '0.78rem', color: '#666', fontStyle: 'italic' }}>
                          Link will activate once a classmate connects.
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#F59E0B" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#111111' }}>
                  Open Slots Offered by Classmates ({availableClassmateSlots.length})
                </h3>
              </div>
            </div>

            {loading ? (
              <div style={{
                background: '#ffffff',
                border: '2px solid #111111',
                borderRadius: '12px',
                padding: '2.5rem',
                textAlign: 'center',
                boxShadow: '3px 3px 0px 0px #111111',
                color: '#666'
              }}>
                Loading available peer slots...
              </div>
            ) : availableClassmateSlots.length === 0 ? (
              <div style={{
                background: '#ffffff',
                border: '2px dashed #999999',
                borderRadius: '12px',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#FEF3C7',
                  border: '2px solid #111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0px 0px #111111'
                }}>
                  <Users size={26} color="#111111" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111111' }}>
                  No open study slots right now
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#666', maxWidth: '420px', lineHeight: 1.5 }}>
                  Be the first in your cohort to offer a study slot! Set your preferred time, and a classmate can connect with you with one click.
                </p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    marginTop: '0.5rem',
                    background: '#0f6f8f',
                    color: '#ffffff',
                    border: '2px solid #111111',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px 0px #111111'
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
                    border: '2px solid #111111',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '4px 4px 0px 0px #111111',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'transform 0.15s ease'
                  }}>
                    <div>
                      {/* Host Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          background: '#E0F2FE',
                          border: '2px solid #111111',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: '#0369a1',
                          boxShadow: '1.5px 1.5px 0px 0px #111111'
                        }}>
                          {slot.hostName ? slot.hostName.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.925rem', color: '#111111' }}>
                            {slot.hostName || 'Classmate'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Course Peer
                          </div>
                        </div>
                      </div>

                      {/* Topic */}
                      <div style={{
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        color: '#111111',
                        marginBottom: '8px',
                        lineHeight: 1.3
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
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '8px'
                      }}>
                        <Calendar size={14} color="#0f6f8f" />
                        <span>{formatDateTime(slot.scheduledStartTime)}</span>
                      </div>

                      {/* Notes / Description */}
                      {slot.notes && (
                        <p style={{
                          fontSize: '0.825rem',
                          color: '#4b5563',
                          margin: 0,
                          lineHeight: 1.4,
                          background: '#fffdf5',
                          borderLeft: '3px solid #FACC15',
                          padding: '4px 8px'
                        }}>
                          "{slot.notes}"
                        </p>
                      )}
                    </div>

                    {/* Connect Button */}
                    <button
                      type="button"
                      onClick={() => handleBookSlot(slot.sessionId, slot.hostName)}
                      disabled={actionId === slot.sessionId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: '#FACC15',
                        color: '#111111',
                        border: '2px solid #111111',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        boxShadow: '2px 2px 0px 0px #111111',
                        transition: 'transform 0.1s ease'
                      }}
                      onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(1.5px, 1.5px)'; }}
                      onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
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

      {/* ── TAB 2: 1:1 MENTOR OFFICE HOURS (Existing System) ── */}
      {activeTab === 'mentor' && (
        <div style={{
          background: '#ffffff',
          border: '2px solid #111111',
          borderRadius: '14px',
          padding: '2rem',
          boxShadow: '4px 4px 0px 0px #111111',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div>
            <span style={{
              background: '#E0F2FE',
              border: '1.5px solid #111111',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#0369a1'
            }}>
              OFFICE HOURS
            </span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#111111', margin: '8px 0 4px 0' }}>
              1:1 Mentor Scheduling
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.5 }}>
              Book dedicated office hours with instructors and industry mentors to review assignments, unblock doubts, and discuss career roadmaps.
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />

          {qaLesson?.qaLink ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111' }}>
                Your current Q&A and mentoring calendar booking link is active:
              </div>
              <a
                href={qaLesson.qaLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#0f6f8f',
                  color: '#ffffff',
                  border: '2px solid #111111',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0px 0px #111111'
                }}
              >
                <Calendar size={18} /> Open Mentor Booking Calendar <ExternalLink size={16} />
              </a>
            </div>
          ) : (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.5rem',
              color: '#64748b',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={20} color="#94a3b8" />
              <span>No mentor scheduling link is released yet for your completed course modules. Mentoring slots open as you progress.</span>
            </div>
          )}
        </div>
      )}

      {/* ── CREATE STUDY SLOT MODAL (Neobrutalism Design) ── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            border: '3px solid #111111',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '540px',
            boxShadow: '8px 8px 0px 0px #111111',
            padding: '1.75rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{
                  background: '#FFF3A7',
                  border: '1.5px solid #111111',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#111111'
                }}>
                  NEW STUDY SLOT
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: 900, color: '#111111' }}>
                  Offer a Peer Study Slot
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f4f4f5',
                  border: '2px solid #111111',
                  borderRadius: '8px',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* Topic */}
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#111111', marginBottom: '6px' }}>
                  Discussion Topic / Goal *
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
                    border: '2px solid #111111',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
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
                        background: formTopic === topic ? '#FACC15' : '#f4f4f5',
                        border: '1.5px solid #111111',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: '#111111'
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
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#111111', marginBottom: '6px' }}>
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
                      border: '2px solid #111111',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#111111', marginBottom: '6px' }}>
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      border: '2px solid #111111',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Duration Pills */}
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#111111', marginBottom: '6px' }}>
                  Duration
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setFormDuration(mins)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '2px solid #111111',
                        borderRadius: '8px',
                        background: formDuration === mins ? '#0f6f8f' : '#ffffff',
                        color: formDuration === mins ? '#ffffff' : '#111111',
                        fontWeight: 700,
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        boxShadow: formDuration === mins ? '2px 2px 0px 0px #111111' : 'none'
                      }}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#111111', marginBottom: '6px' }}>
                  Notes / Agenda (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Let's do 20 mins mock case, 15 mins mutual feedback."
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    border: '2px solid #111111',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Custom Video Link */}
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#111111', marginBottom: '4px' }}>
                  Custom Video Meeting Link (Optional)
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
                    border: '2px solid #111111',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
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
                    border: '2px solid #111111',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: '#FACC15',
                    color: '#111111',
                    border: '2px solid #111111',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px 0px #111111'
                  }}
                >
                  {submitting ? 'Posting Slot...' : 'Post Study Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
