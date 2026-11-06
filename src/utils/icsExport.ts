import { ScheduledMeeting } from '../types/diagnosis';

/**
 * Utilitários para criação de arquivos ICS e links para Google Calendar
 * Fuso horário: America/Sao_Paulo
 */

export function generateICS(meeting: ScheduledMeeting): string {
  const [year, month, day] = meeting.date.split('-');
  const [hour, minute] = meeting.time.split(':');

  // Formato iCalendar UTC / TZ: YYYYMMDDTHHmmSS
  const startYear = year;
  const startMonth = month.padStart(2, '0');
  const startDay = day.padStart(2, '0');
  const startHour = hour.padStart(2, '0');
  const startMin = minute.padStart(2, '0');

  // Duração de 45 minutos para a devolutiva
  const endMinNum = parseInt(minute, 10) + 45;
  let endHourNum = parseInt(hour, 10);
  let finalMin = endMinNum;
  if (endMinNum >= 60) {
    endHourNum += 1;
    finalMin = endMinNum - 60;
  }
  const endHour = endHourNum.toString().padStart(2, '0');
  const endMin = finalMin.toString().padStart(2, '0');

  const dtStart = `${startYear}${startMonth}${startDay}T${startHour}${startMin}00`;
  const dtEnd = `${startYear}${startMonth}${startDay}T${endHour}${endMin}00`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const summary = `Devolutiva do Diagnóstico Empresarial Cresce Del-Rei - ${meeting.companyName}`;
  const description = `Reunião executiva de devolutiva do Diagnóstico Empresarial Cresce Del-Rei.\\n\\nEntidade: ${meeting.entity}\\nConsultor: ${meeting.consultantName}\\nParticipante: ${meeting.contactName} (${meeting.companyName})\\n\\nLink da Videoconferência Google Meet:\\n${meeting.meetLink}\\n\\nOrganização: ACI Del-Rei e Vortex.`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ACI Del-Rei & Vortex//Diagnostico Cresce Del-Rei//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VTIMEZONE',
    'TZID:America/Sao_Paulo',
    'X-LIC-LOCATION:America/Sao_Paulo',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:-0300',
    'TZOFFSETTO:-0300',
    'TZNAME:BRT',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:cresce-delrei-${meeting.id}@acidelrei.org.br`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=America/Sao_Paulo:${dtStart}`,
    `DTEND;TZID=America/Sao_Paulo:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${meeting.meetLink}`,
    `ORGANIZER;CN="${meeting.entity}":mailto:contato@acidelrei.org.br`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN="${meeting.contactName}":mailto:${meeting.contactEmail}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete: Devolutiva do Diagnóstico em 15 minutos',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICSFile(meeting: ScheduledMeeting): void {
  const icsData = generateICS(meeting);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reuniao-devolutiva-${meeting.date}-${meeting.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function generateGoogleCalendarUrl(meeting: ScheduledMeeting): string {
  const [year, month, day] = meeting.date.split('-');
  const [hour, minute] = meeting.time.split(':');

  const startHour = hour.padStart(2, '0');
  const startMin = minute.padStart(2, '0');

  const endMinNum = parseInt(minute, 10) + 45;
  let endHourNum = parseInt(hour, 10);
  let finalMin = endMinNum;
  if (endMinNum >= 60) {
    endHourNum += 1;
    finalMin = endMinNum - 60;
  }
  const endHour = endHourNum.toString().padStart(2, '0');
  const endMin = finalMin.toString().padStart(2, '0');

  const datesParam = `${year}${month}${day}T${startHour}${startMin}00/${year}${month}${day}T${endHour}${endMin}00`;
  const text = encodeURIComponent(`Devolutiva Diagnóstico Cresce Del-Rei - ${meeting.companyName}`);
  const details = encodeURIComponent(
    `Reunião de devolutiva do Diagnóstico Empresarial Cresce Del-Rei.\n\nConsultor: ${meeting.consultantName} (${meeting.entity})\nVideoconferência: ${meeting.meetLink}\n\nRealização: ACI Del-Rei & Vortex`
  );
  const location = encodeURIComponent(meeting.meetLink);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${datesParam}&details=${details}&location=${location}&ctz=America/Sao_Paulo`;
}
