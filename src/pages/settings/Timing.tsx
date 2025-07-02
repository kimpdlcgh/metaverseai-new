import React, { useState } from 'react';
import { Clock, Plus } from 'lucide-react';

export default function Timing() {
  // TODO: integrate with Supabase
  const [location1Data, setLocation1Data] = useState({
    monday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    tuesday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    wednesday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    thursday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    friday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }, { start: '09:00', end: '20:00' }] },
    saturday: { fullDay: true, shifts: [{ start: '09:00', end: '20:00' }] },
    sunday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    emergency: {
      availability24x7: true,
      helpline24x7: false
    }
  });

  const [location2Data, setLocation2Data] = useState({
    monday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    tuesday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    wednesday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    thursday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    friday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }, { start: '09:00', end: '20:00' }] },
    saturday: { fullDay: true, shifts: [{ start: '09:00', end: '20:00' }] },
    sunday: { fullDay: false, shifts: [{ start: '09:00', end: '20:00' }] },
    emergency: {
      availability24x7: true,
      helpline24x7: false
    }
  });

  const [activeTab, setActiveTab] = useState({
    location1: 'Office',
    location2: 'Office'
  });

  // TODO: integrate with Supabase
  const handleToggleFullDay = (location: 'location1' | 'location2', day: string) => {
    if (location === 'location1') {
      setLocation1Data(prev => ({
        ...prev,
        [day]: {
          ...prev[day as keyof typeof prev],
          fullDay: !prev[day as keyof typeof prev].fullDay
        }
      }));
    } else {
      setLocation2Data(prev => ({
        ...prev,
        [day]: {
          ...prev[day as keyof typeof prev],
          fullDay: !prev[day as keyof typeof prev].fullDay
        }
      }));
    }
  };

  // TODO: integrate with Supabase
  const handleTimeChange = (location: 'location1' | 'location2', day: string, shiftIndex: number, field: 'start' | 'end', value: string) => {
    if (location === 'location1') {
      setLocation1Data(prev => {
        const dayData = prev[day as keyof typeof prev];
        const updatedShifts = [...dayData.shifts];
        updatedShifts[shiftIndex] = {
          ...updatedShifts[shiftIndex],
          [field]: value
        };
        
        return {
          ...prev,
          [day]: {
            ...dayData,
            shifts: updatedShifts
          }
        };
      });
    } else {
      setLocation2Data(prev => {
        const dayData = prev[day as keyof typeof prev];
        const updatedShifts = [...dayData.shifts];
        updatedShifts[shiftIndex] = {
          ...updatedShifts[shiftIndex],
          [field]: value
        };
        
        return {
          ...prev,
          [day]: {
            ...dayData,
            shifts: updatedShifts
          }
        };
      });
    }
  };

  // TODO: integrate with Supabase
  const handleAddShift = (location: 'location1' | 'location2', day: string) => {
    if (location === 'location1') {
      setLocation1Data(prev => {
        const dayData = prev[day as keyof typeof prev];
        return {
          ...prev,
          [day]: {
            ...dayData,
            shifts: [...dayData.shifts, { start: '09:00', end: '20:00' }]
          }
        };
      });
    } else {
      setLocation2Data(prev => {
        const dayData = prev[day as keyof typeof prev];
        return {
          ...prev,
          [day]: {
            ...dayData,
            shifts: [...dayData.shifts, { start: '09:00', end: '20:00' }]
          }
        };
      });
    }
  };

  // TODO: integrate with Supabase
  const handleEmergencyToggle = (location: 'location1' | 'location2', field: 'availability24x7' | 'helpline24x7') => {
    if (location === 'location1') {
      setLocation1Data(prev => ({
        ...prev,
        emergency: {
          ...prev.emergency,
          [field]: !prev.emergency[field]
        }
      }));
    } else {
      setLocation2Data(prev => ({
        ...prev,
        emergency: {
          ...prev.emergency,
          [field]: !prev.emergency[field]
        }
      }));
    }
  };

  // TODO: integrate with Supabase
  const handleSave = () => {
    console.log('Saving timing settings', { location1Data, location2Data });
  };

  return (
    <div>
      <div className="container-fluid mt-4">
        <div className="row gx-3 align-items-center">
          <div className="col-12 col-sm">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li className="breadcrumb-item"><a href="/app/settings">Settings</a></li>
                <li className="breadcrumb-item active" aria-current="page">Timing</li>
              </ol>
            </nav>
            <h5>Setting Timing</h5>
          </div>
        </div>
      </div>

      <div className="container mt-4" id="main-content">
        <div className="card bg-white rounded-lg shadow-sm mb-4" data-bs-target="#navbarpill" data-bs-spy="scroll">
          <div className="card-body py-0">
            <div className="position-sticky bg-white py-3 mb-0 z-10 header-pt mb-3" id="navbarpill">
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <a className="nav-link active" href="#scrollspayone">Location 1</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#scrollspaytwo">Location 2</a>
                </li>
              </ul>
            </div>

            <div id="scrollspayone" className="mb-4 mb-lg-5" style={{ scrollMargin: '150px' }}>
              <h5 className="mb-3"><i className="bi bi-hospital fs-4 me-2 align-middle"></i> Location 1 timing</h5>
              <nav className="mb-3">
                <div className="nav nav-underline" id="nav-tab-loc-1" role="tablist">
                  <button 
                    className={`nav-link ${activeTab.location1 === 'Office' ? 'active' : ''}`} 
                    onClick={() => setActiveTab({...activeTab, location1: 'Office'})}
                  >
                    Office
                  </button>
                  <button 
                    className={`nav-link ${activeTab.location1 === 'Agents' ? 'active' : ''}`}
                    onClick={() => setActiveTab({...activeTab, location1: 'Agents'})}
                  >
                    Agents
                  </button>
                  <button 
                    className={`nav-link ${activeTab.location1 === 'Staff' ? 'active' : ''}`}
                    onClick={() => setActiveTab({...activeTab, location1: 'Staff'})}
                  >
                    Staff
                  </button>
                </div>
              </nav>
              <div className="tab-content mb-4">
                <div className={`tab-pane fade ${activeTab.location1 === 'Office' ? 'show active' : ''}`}>
                  {/* Monday */}
                  <div className="row mb-2">
                    <div className="col-6 col-md-3 col-xl-2 pt-3">
                      <h6 className="mb-3">Monday</h6>
                    </div>
                    <div className="col-auto pt-3">
                      <div className="form-check form-switch mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="monday"
                          checked={location1Data.monday.fullDay}
                          onChange={() => handleToggleFullDay('location1', 'monday')}
                        />
                        <label className="form-check-label" htmlFor="monday">Full Day</label>
                      </div>
                    </div>
                    {!location1Data.monday.fullDay && location1Data.monday.shifts.map((shift, index) => (
                      <React.Fragment key={index}>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.start} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'monday', index, 'start', e.target.value)}
                            />
                            <label>Start Time</label>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.end} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'monday', index, 'end', e.target.value)}
                            />
                            <label>End Time</label>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="col-auto pt-2">
                      <button 
                        className="btn btn-link mb-3"
                        onClick={() => handleAddShift('location1', 'monday')}
                        disabled={location1Data.monday.fullDay}
                      >
                        <Plus className="w-4 h-4 inline mr-1" /> Add Shift
                      </button>
                    </div>
                  </div>

                  {/* Tuesday */}
                  <div className="row mb-2">
                    <div className="col-6 col-md-3 col-xl-2 pt-3">
                      <h6 className="mb-3">Tuesday</h6>
                    </div>
                    <div className="col-auto pt-3">
                      <div className="form-check form-switch mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="tuesday"
                          checked={location1Data.tuesday.fullDay}
                          onChange={() => handleToggleFullDay('location1', 'tuesday')}
                        />
                        <label className="form-check-label" htmlFor="tuesday">Full Day</label>
                      </div>
                    </div>
                    {!location1Data.tuesday.fullDay && location1Data.tuesday.shifts.map((shift, index) => (
                      <React.Fragment key={index}>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.start} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'tuesday', index, 'start', e.target.value)}
                            />
                            <label>Start Time</label>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.end} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'tuesday', index, 'end', e.target.value)}
                            />
                            <label>End Time</label>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="col-auto pt-2">
                      <button 
                        className="btn btn-link mb-3"
                        onClick={() => handleAddShift('location1', 'tuesday')}
                        disabled={location1Data.tuesday.fullDay}
                      >
                        <Plus className="w-4 h-4 inline mr-1" /> Add Shift
                      </button>
                    </div>
                  </div>

                  {/* Wednesday */}
                  <div className="row mb-2">
                    <div className="col-6 col-md-3 col-xl-2 pt-3">
                      <h6 className="mb-3">Wednesday</h6>
                    </div>
                    <div className="col-auto pt-3">
                      <div className="form-check form-switch mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="wednesday"
                          checked={location1Data.wednesday.fullDay}
                          onChange={() => handleToggleFullDay('location1', 'wednesday')}
                        />
                        <label className="form-check-label" htmlFor="wednesday">Full Day</label>
                      </div>
                    </div>
                    {!location1Data.wednesday.fullDay && location1Data.wednesday.shifts.map((shift, index) => (
                      <React.Fragment key={index}>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.start} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'wednesday', index, 'start', e.target.value)}
                            />
                            <label>Start Time</label>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.end} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'wednesday', index, 'end', e.target.value)}
                            />
                            <label>End Time</label>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="col-auto pt-2">
                      <button 
                        className="btn btn-link mb-3"
                        onClick={() => handleAddShift('location1', 'wednesday')}
                        disabled={location1Data.wednesday.fullDay}
                      >
                        <Plus className="w-4 h-4 inline mr-1" /> Add Shift
                      </button>
                    </div>
                  </div>

                  {/* Thursday */}
                  <div className="row mb-2">
                    <div className="col-6 col-md-3 col-xl-2 pt-3">
                      <h6 className="mb-3">Thursday</h6>
                    </div>
                    <div className="col-auto pt-3">
                      <div className="form-check form-switch mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="thursday"
                          checked={location1Data.thursday.fullDay}
                          onChange={() => handleToggleFullDay('location1', 'thursday')}
                        />
                        <label className="form-check-label" htmlFor="thursday">Full Day</label>
                      </div>
                    </div>
                    {!location1Data.thursday.fullDay && location1Data.thursday.shifts.map((shift, index) => (
                      <React.Fragment key={index}>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.start} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'thursday', index, 'start', e.target.value)}
                            />
                            <label>Start Time</label>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.end} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'thursday', index, 'end', e.target.value)}
                            />
                            <label>End Time</label>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="col-auto pt-2">
                      <button 
                        className="btn btn-link mb-3"
                        onClick={() => handleAddShift('location1', 'thursday')}
                        disabled={location1Data.thursday.fullDay}
                      >
                        <Plus className="w-4 h-4 inline mr-1" /> Add Shift
                      </button>
                    </div>
                  </div>

                  {/* Friday */}
                  <div className="row mb-2">
                    <div className="col-6 col-md-3 col-xl-2 pt-3">
                      <h6 className="mb-3">Friday</h6>
                    </div>
                    <div className="col-auto pt-3">
                      <div className="form-check form-switch mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="friday"
                          checked={location1Data.friday.fullDay}
                          onChange={() => handleToggleFullDay('location1', 'friday')}
                        />
                        <label className="form-check-label" htmlFor="friday">Full Day</label>
                      </div>
                    </div>
                    {!location1Data.friday.fullDay && location1Data.friday.shifts.map((shift, index) => (
                      <React.Fragment key={index}>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.start} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'friday', index, 'start', e.target.value)}
                            />
                            <label>Start Time</label>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.end} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'friday', index, 'end', e.target.value)}
                            />
                            <label>End Time</label>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="col-auto pt-2">
                      <button 
                        className="btn btn-link mb-3"
                        onClick={() => handleAddShift('location1', 'friday')}
                        disabled={location1Data.friday.fullDay}
                      >
                        <Plus className="w-4 h-4 inline mr-1" /> Add Shift
                      </button>
                    </div>
                  </div>

                  {/* Saturday */}
                  <div className="row mb-2">
                    <div className="col-6 col-md-3 col-xl-2 pt-3">
                      <h6 className="mb-3">Saturday</h6>
                    </div>
                    <div className="col-auto pt-3">
                      <div className="form-check form-switch mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="saturday"
                          checked={location1Data.saturday.fullDay}
                          onChange={() => handleToggleFullDay('location1', 'saturday')}
                        />
                        <label className="form-check-label" htmlFor="saturday">Full Day</label>
                      </div>
                    </div>
                    {!location1Data.saturday.fullDay && location1Data.saturday.shifts.map((shift, index) => (
                      <React.Fragment key={index}>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.start} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'saturday', index, 'start', e.target.value)}
                            />
                            <label>Start Time</label>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.end} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'saturday', index, 'end', e.target.value)}
                            />
                            <label>End Time</label>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="col-auto pt-2">
                      <button 
                        className="btn btn-link mb-3"
                        onClick={() => handleAddShift('location1', 'saturday')}
                        disabled={location1Data.saturday.fullDay}
                      >
                        <Plus className="w-4 h-4 inline mr-1" /> Add Shift
                      </button>
                    </div>
                  </div>

                  {/* Sunday */}
                  <div className="row mb-2">
                    <div className="col-6 col-md-3 col-xl-2 pt-3">
                      <h6 className="mb-3">Sunday</h6>
                    </div>
                    <div className="col-auto pt-3">
                      <div className="form-check form-switch mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="sunday"
                          checked={location1Data.sunday.fullDay}
                          onChange={() => handleToggleFullDay('location1', 'sunday')}
                        />
                        <label className="form-check-label" htmlFor="sunday">Full Day</label>
                      </div>
                    </div>
                    {!location1Data.sunday.fullDay && location1Data.sunday.shifts.map((shift, index) => (
                      <React.Fragment key={index}>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.start} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'sunday', index, 'start', e.target.value)}
                            />
                            <label>Start Time</label>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="form-floating mb-3">
                            <input 
                              type="time" 
                              value={shift.end} 
                              className="form-control"
                              onChange={(e) => handleTimeChange('location1', 'sunday', index, 'end', e.target.value)}
                            />
                            <label>End Time</label>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="col-auto pt-2">
                      <button 
                        className="btn btn-link mb-3"
                        onClick={() => handleAddShift('location1', 'sunday')}
                        disabled={location1Data.sunday.fullDay}
                      >
                        <Plus className="w-4 h-4 inline mr-1" /> Add Shift
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`tab-pane fade ${activeTab.location1 === 'Agents' ? 'show active' : ''}`}>
                  <div className="p-4 text-center">
                    <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h5>Agents Timing Configuration</h5>
                    <p className="text-gray-500">Configure agent schedules and availability here.</p>
                  </div>
                </div>
                <div className={`tab-pane fade ${activeTab.location1 === 'Staff' ? 'show active' : ''}`}>
                  <div className="p-4 text-center">
                    <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h5>Staff Timing Configuration</h5>
                    <p className="text-gray-500">Configure staff schedules and availability here.</p>
                  </div>
                </div>
              </div>

              <h6 className="mb-3">Emergency Service</h6>
              <div className="row">
                <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="profileswitch2"
                      checked={location1Data.emergency.availability24x7}
                      onChange={() => handleEmergencyToggle('location1', 'availability24x7')}
                    />
                    <label className="form-check-label" htmlFor="profileswitch2">24x7 Availability</label>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="profileswitch4"
                      checked={location1Data.emergency.helpline24x7}
                      onChange={() => handleEmergencyToggle('location1', 'helpline24x7')}
                    />
                    <label className="form-check-label" htmlFor="profileswitch4">24x7 Helpline on</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Location 2 */}
            <div id="scrollspaytwo" className="mb-4 mb-lg-5" style={{ scrollMargin: '150px' }}>
              <h5 className="mb-3"><i className="bi bi-hospital fs-4 me-2 align-middle"></i> Location 2 timing</h5>
              <nav className="mb-3">
                <div className="nav nav-underline" id="nav-tab-loc-2" role="tablist">
                  <button 
                    className={`nav-link ${activeTab.location2 === 'Office' ? 'active' : ''}`} 
                    onClick={() => setActiveTab({...activeTab, location2: 'Office'})}
                  >
                    Office
                  </button>
                  <button 
                    className={`nav-link ${activeTab.location2 === 'Agents' ? 'active' : ''}`}
                    onClick={() => setActiveTab({...activeTab, location2: 'Agents'})}
                  >
                    Agents
                  </button>
                  <button 
                    className={`nav-link ${activeTab.location2 === 'Staff' ? 'active' : ''}`}
                    onClick={() => setActiveTab({...activeTab, location2: 'Staff'})}
                  >
                    Staff
                  </button>
                </div>
              </nav>
              <div className="tab-content mb-4">
                <div className={`tab-pane fade ${activeTab.location2 === 'Office' ? 'show active' : ''}`}>
                  {/* Similar structure as Location 1, but with location2Data */}
                  <div className="p-4 text-center">
                    <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h5>Location 2 Office Timing</h5>
                    <p className="text-gray-500">Configure office hours for Location 2 here.</p>
                  </div>
                </div>
                <div className={`tab-pane fade ${activeTab.location2 === 'Agents' ? 'show active' : ''}`}>
                  <div className="p-4 text-center">
                    <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h5>Agents Timing Configuration</h5>
                    <p className="text-gray-500">Configure agent schedules and availability here.</p>
                  </div>
                </div>
                <div className={`tab-pane fade ${activeTab.location2 === 'Staff' ? 'show active' : ''}`}>
                  <div className="p-4 text-center">
                    <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h5>Staff Timing Configuration</h5>
                    <p className="text-gray-500">Configure staff schedules and availability here.</p>
                  </div>
                </div>
              </div>

              <h6 className="mb-3">Emergency Service</h6>
              <div className="row">
                <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="profileswitch3"
                      checked={location2Data.emergency.availability24x7}
                      onChange={() => handleEmergencyToggle('location2', 'availability24x7')}
                    />
                    <label className="form-check-label" htmlFor="profileswitch3">24x7 Availability</label>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="profileswitch5"
                      checked={location2Data.emergency.helpline24x7}
                      onChange={() => handleEmergencyToggle('location2', 'helpline24x7')}
                    />
                    <label className="form-check-label" htmlFor="profileswitch5">24x7 Helpline on</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col">
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-link">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}