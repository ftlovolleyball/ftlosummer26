// ─────────────────────────────────────────────────────────────────────────────
// FTLO APPS SCRIPT — YOUTH JULY 11 TOURNAMENT (complete add-in)
// ─────────────────────────────────────────────────────────────────────────────
//
// SETUP (two steps):
//
//  1. Paste the THREE functions below anywhere in your Apps Script file:
//       • handleYouthJuly11Submit(data, ss)
//       • sendYouthRegistrationEmail(data)
//       • _emailRow(label, value)
//
//  2. Inside your existing doPost(e) function, find where you parse the
//     incoming POST data (usually something like JSON.parse(e.postData.contents))
//     and add this block alongside your other tab handlers:
//
//       if (data.tab === 'Youth-July11') {
//         handleYouthJuly11Submit(data, SpreadsheetApp.getActiveSpreadsheet());
//         return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
//                              .setMimeType(ContentService.MimeType.JSON);
//       }
//
// ─────────────────────────────────────────────────────────────────────────────


// Writes the registration row to the Youth-July11 sheet tab and sends the
// guardian email with the consent form link.
function handleYouthJuly11Submit(data, ss) {

  // ── 1. Write row to sheet ──────────────────────────────────────────────────
  var sheetName = 'Youth-July11';
  var sheet = ss.getSheetByName(sheetName);

  // Create the sheet and header row the very first time
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      'Timestamp',
      'First Name', 'Last Name', 'Date of Birth', 'Athlete Email', 'Athlete Phone',
      'Club / Program',
      'Division', 'Team Size', 'Teammates (with gender)', 'Skill Level',
      'Guardian Name', 'Guardian Email', 'Guardian Phone', 'Relationship',
      'Conduct Agreed',
      'Payer Email', 'Payment Amount', 'E-transfer Ref',
      'Comments',
      'Consent Signed'  // left blank; you fill this in manually once the waiver is received
    ]);
  }

  sheet.appendRow([
    data.timestamp    || new Date().toLocaleString('en-CA', {timeZone:'America/Vancouver'}),
    data.firstName    || '',
    data.lastName     || '',
    data.dob          || '',
    data.email        || '',
    data.phone        || '',
    data.program      || '',
    data.division     || '',
    data.teamSize     || '',
    data.teammates    || '',
    data.skillLevel   || '',
    data.guardianName || '',
    data.guardianEmail|| '',
    data.guardianPhone|| '',
    data.guardianRelation || '',
    data.conductAgreed|| '',
    data.payerEmail   || '',
    data.paymentAmount|| '',
    data.payComment   || '',
    data.comments     || '',
    ''  // Consent Signed — blank until you manually check it off
  ]);

  // ── 2. Send guardian email ─────────────────────────────────────────────────
  if (data.guardianEmail) {
    sendYouthRegistrationEmail(data);
  }
}


function sendYouthRegistrationEmail(data) {
  var WAIVER_URL = 'https://ftlovolleyball.github.io/ftlosummer26/tournament-youth-waiver.html';
  var CC         = 'youth@ftlovolleyball.ca, operations@ftlovolleyball.ca';

  var athleteName  = ((data.firstName || '') + ' ' + (data.lastName || '')).trim();
  var guardianName = (data.guardianName || 'Parent/Guardian').trim();
  var toEmail      = data.guardianEmail;

  var subject = 'Action Required: Sign Consent Form for ' + athleteName + ' — Youth LM Grass 4s Tournament July 11';

  var html = [
    '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#222;">',

    // Header bar
    '<div style="background:#1F4049;padding:24px 28px;border-radius:8px 8px 0 0;">',
      '<p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#F8BA44;">FTLO Volleyball</p>',
      '<h1 style="margin:0;font-size:22px;line-height:1.25;color:#FFF9F5;">Youth LM Grass 4s Tournament<br>July 11, 2026 — Parent Consent</h1>',
    '</div>',

    // Action required banner
    '<div style="background:#fff3e0;border-left:5px solid #e65100;padding:22px 28px;">',
      '<p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#e65100;">&#9888;&#65039; Action Required</p>',
      '<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#333;">',
        'Hi <strong>' + guardianName + '</strong>,<br><br>',
        '<strong>' + athleteName + '</strong> has registered for the Youth Lower Mainland Grass 4s Tournament',
        ' on <strong>Saturday, July 11, 2026</strong> at Thomas Kidd Elementary Park, Richmond, BC.',
        '<br><br>',
        '<strong>ALL participating players must have this consent form electronically signed by a parent or guardian before they can participate.</strong>',
        ' Please open the form using the button below and complete it at your earliest convenience.',
      '</p>',
      '<a href="' + WAIVER_URL + '"',
        ' style="display:inline-block;background:#e65100;color:#ffffff;font-size:15px;font-weight:700;',
        'text-transform:uppercase;padding:14px 28px;border-radius:7px;text-decoration:none;letter-spacing:0.4px;">',
        '&#128221; Open &amp; Sign Parent Consent Form &rarr;',
      '</a>',
      '<p style="margin:12px 0 0;font-size:12px;color:#999;">',
        'Or copy this link: <a href="' + WAIVER_URL + '" style="color:#e65100;">' + WAIVER_URL + '</a>',
      '</p>',
    '</div>',

    // Registration summary
    '<div style="background:#f7f7f7;border:1px solid #e0e0e0;border-top:none;padding:22px 28px;">',
      '<p style="margin:0 0 14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#1F4049;">Registration Summary</p>',

      _emailRow('Athlete',         athleteName       || '—'),
      _emailRow('Date of Birth',   data.dob          || '—'),
      _emailRow('Athlete Email',   data.email        || '—'),
      _emailRow('Athlete Phone',   data.phone        || '—'),
      _emailRow('Club / Program',  data.program      || '—'),

      '<div style="border-top:1px solid #ddd;margin:12px 0;"></div>',

      _emailRow('Division',        data.division     || '—'),
      _emailRow('Team Size',       data.teamSize     || '—'),
      _emailRow('Teammates',       (data.teammates   || '—').replace(/\n/g, '<br>')),
      _emailRow('Skill Level',     data.skillLevel   || '—'),

      '<div style="border-top:1px solid #ddd;margin:12px 0;"></div>',

      _emailRow('Guardian Name',   guardianName),
      _emailRow('Guardian Email',  data.guardianEmail  || '—'),
      _emailRow('Guardian Phone',  data.guardianPhone  || '—'),
      _emailRow('Relationship',    data.guardianRelation || '—'),

      '<div style="border-top:1px solid #ddd;margin:12px 0;"></div>',

      _emailRow('Payment Amount',  data.paymentAmount || '—'),
      _emailRow('Payer Email',     data.payerEmail    || '—'),
      _emailRow('E-transfer Ref',  data.payComment    || '—'),

      (data.comments ? _emailRow('Comments', data.comments) : ''),

      '<div style="border-top:1px solid #ddd;margin:12px 0;"></div>',
      _emailRow('Submitted',       data.timestamp    || '—'),
    '</div>',

    // Footer
    '<div style="background:#1F4049;padding:16px 28px;border-radius:0 0 8px 8px;text-align:center;">',
      '<p style="margin:0;font-size:12px;color:rgba(255,249,245,0.55);">',
        'FTLO Volleyball Association &mdash; ',
        '<a href="https://www.ftlovolleyball.ca" style="color:#F8BA44;text-decoration:none;">ftlovolleyball.ca</a>',
      '</p>',
    '</div>',

    '</div>'
  ].join('');

  GmailApp.sendEmail(toEmail, subject, '', {
    htmlBody: html,
    cc: CC,
    name: 'FTLO Volleyball'
  });
}


// Helper: one labelled row in the summary block
function _emailRow(label, value) {
  return '<div style="display:flex;gap:8px;margin-bottom:8px;font-size:14px;line-height:1.5;">' +
    '<span style="min-width:150px;font-weight:700;color:#444;flex-shrink:0;">' + label + ':</span>' +
    '<span style="color:#222;">' + value + '</span>' +
    '</div>';
}
