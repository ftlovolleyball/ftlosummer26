// ─────────────────────────────────────────────────────────────────────────────
// FTLO APPS SCRIPT — YOUTH TOURNAMENT EMAIL SNIPPET
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD THIS TO YOUR APPS SCRIPT:
//
//  1. Open script.google.com → open your FTLO Apps Script project
//  2. Paste the sendYouthRegistrationEmail() function anywhere in the file
//  3. Inside your existing doPost() handler, find the block that handles
//     action === 'submitTournament' and add ONE line after you append the row:
//
//       if (data.tab === 'Youth-July11') sendYouthRegistrationEmail(data);
//
//  4. Save and re-deploy (Deploy → Manage deployments → new version)
// ─────────────────────────────────────────────────────────────────────────────

function sendYouthRegistrationEmail(data) {
  var WAIVER_URL = 'https://ftlovolleyball.github.io/ftlosummer26/tournament-youth-waiver.html';
  var CC         = 'youth@ftlovolleyball.ca, operations@ftlovolleyball.ca';

  var athleteName  = (data.firstName  || '') + ' ' + (data.lastName  || '');
  var guardianName = data.guardianName || 'Parent/Guardian';
  var toEmail      = data.guardianEmail;

  if (!toEmail) return; // no guardian email — skip

  var subject = 'Action Required: Consent Form for ' + athleteName.trim() + ' — FTLO Youth Tournament (July 11)';

  var html = [
    '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#222;">',

    // Header
    '<div style="background:#1F4049;padding:24px 28px;border-radius:8px 8px 0 0;">',
      '<p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#F8BA44;">FTLO Volleyball</p>',
      '<h1 style="margin:6px 0 0;font-size:22px;color:#FFF9F5;">Youth Tournament — July 11, 2026</h1>',
    '</div>',

    // Consent call-to-action
    '<div style="background:#fff3e0;border-left:5px solid #e65100;padding:20px 28px;margin:0;">',
      '<p style="margin:0 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#e65100;">&#9888; Action Required</p>',
      '<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#333;">',
        'Hi ' + guardianName + ',<br><br>',
        '<strong>' + athleteName.trim() + '</strong> has registered for the FTLO Youth Tournament on <strong>July 11, 2026</strong>.',
        ' As a parent or guardian, you must complete and electronically sign the consent form below before they can participate.',
        ' <strong>ALL participating players must have this form signed.</strong>',
      '</p>',
      '<a href="' + WAIVER_URL + '" style="display:inline-block;background:#e65100;color:#fff;font-size:15px;font-weight:700;text-transform:uppercase;padding:14px 28px;border-radius:7px;text-decoration:none;letter-spacing:0.5px;">',
        '&#128221; Open &amp; Sign Parent Consent Form &rarr;',
      '</a>',
      '<p style="margin:12px 0 0;font-size:12px;color:#888;">',
        'Direct link: <a href="' + WAIVER_URL + '" style="color:#e65100;">' + WAIVER_URL + '</a>',
      '</p>',
    '</div>',

    // Registration summary
    '<div style="background:#f9f9f9;padding:20px 28px;border:1px solid #e0e0e0;border-top:none;">',
      '<p style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1F4049;">Registration Summary</p>',

      _emailRow('Athlete',        athleteName.trim()),
      _emailRow('Date of Birth',  data.dob      || '—'),
      _emailRow('Athlete Email',  data.email    || '—'),
      _emailRow('Athlete Phone',  data.phone    || '—'),
      _emailRow('Club / Program', data.program  || '—'),

      '<hr style="border:none;border-top:1px solid #ddd;margin:12px 0;">',

      _emailRow('Division',       data.division   || '—'),
      _emailRow('Team Size',      data.teamSize   || '—'),
      _emailRow('Teammates',      (data.teammates || '—').replace(/\n/g, '<br>')),
      _emailRow('Skill Level',    data.skillLevel || '—'),

      '<hr style="border:none;border-top:1px solid #ddd;margin:12px 0;">',

      _emailRow('Guardian Name',         guardianName),
      _emailRow('Guardian Email',        data.guardianEmail  || '—'),
      _emailRow('Guardian Phone',        data.guardianPhone  || '—'),
      _emailRow('Relationship',          data.guardianRelation || '—'),

      '<hr style="border:none;border-top:1px solid #ddd;margin:12px 0;">',

      _emailRow('Payment Amount',  data.paymentAmount || '—'),
      _emailRow('Payer Email',     data.payerEmail    || '—'),
      _emailRow('E-transfer Ref',  data.payComment    || '—'),

      (data.comments ? _emailRow('Comments', data.comments) : ''),

      '<hr style="border:none;border-top:1px solid #ddd;margin:12px 0;">',
      _emailRow('Submitted',  data.timestamp || new Date().toString()),
    '</div>',

    // Footer
    '<div style="background:#1F4049;padding:16px 28px;border-radius:0 0 8px 8px;text-align:center;">',
      '<p style="margin:0;font-size:12px;color:rgba(255,249,245,0.6);">',
        'FTLO Volleyball Association &mdash; <a href="https://www.ftlovolleyball.ca" style="color:#F8BA44;">ftlovolleyball.ca</a>',
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

// Helper: one labelled row in the summary table
function _emailRow(label, value) {
  return '<div style="display:flex;gap:8px;margin-bottom:7px;font-size:14px;line-height:1.5;">' +
    '<span style="min-width:145px;font-weight:700;color:#444;">' + label + ':</span>' +
    '<span style="color:#222;">' + value + '</span>' +
    '</div>';
}
