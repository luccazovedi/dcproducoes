// Contact form — conditional fields + WhatsApp submit
(function () {
  const serviceSelect = document.getElementById('service');
  const fieldsMap = {
    corporativo:          'fields-evento',
    sociais:              'fields-evento',
    outros:               'fields-evento',
    feiras_stands:        'fields-feiras',
    producao_audiovisual: 'fields-audiovisual',
  };
  const allConditionals = ['fields-evento', 'fields-feiras', 'fields-audiovisual'];

  function showFields(service) {
    allConditionals.forEach(function (id) {
      const el = document.getElementById(id);
      const match = fieldsMap[service] === id;
      el.style.display = match ? 'block' : 'none';
      el.classList.toggle('visible', match);
    });
  }

  serviceSelect.addEventListener('change', function () { showFields(this.value); });

  // "Já tenho local" — disable location input when checked
  [
    { checkbox: 'has-venue',      input: 'event-location' },
    { checkbox: 'has-venue-fair', input: 'fair-location'  },
    { checkbox: 'has-venue-av',   input: 'av-location'    },
  ].forEach(function (pair) {
    const cb    = document.getElementById(pair.checkbox);
    const input = document.getElementById(pair.input);
    if (!cb || !input) return;
    cb.addEventListener('change', function () {
      if (this.checked) {
        input.style.opacity = '.35';
        input.style.pointerEvents = 'none';
        input.value = '';
        input.placeholder = 'Local já definido';
      } else {
        input.style.opacity = '1';
        input.style.pointerEvents = 'auto';
        input.placeholder = 'Endereço ou nome do espaço';
      }
    });
  });
})();

// Form submit → WhatsApp
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const company  = document.getElementById('company').value.trim();
  const service  = document.getElementById('service').value;
  const budget   = document.getElementById('budget').value.trim();
  const feedback = document.getElementById('formFeedback');

  if (!name || !service) {
    feedback.textContent = 'Por favor, preencha os campos obrigatórios.';
    feedback.className = 'form-feedback error';
    return;
  }

  const serviceLabels = {
    corporativo:          'Corporativo',
    feiras_stands:        'Feiras e Stands',
    producao_audiovisual: 'Produção Audiovisual',
    sociais:              'Sociais',
    outros:               'Outros',
  };

  const solicitacaoLabels = {
    producao_evento:  'Produção de Eventos',
    audiovisual:      'Produção Audiovisual',
    stand_cenografia: 'Stand / Cenografia',
    completo:         'Pacote Completo',
  };

  function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function checked(id) { const el = document.getElementById(id); return el && el.checked ? 'Sim' : 'Não'; }
  function formatDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  let extra = '';

  if (service === 'corporativo' || service === 'sociais' || service === 'outros') {
    const guests = val('event-guests'), date = formatDate(val('event-date')), location = val('event-location');
    if (guests)   extra += `*Quantidade de Pessoas:* ${guests}\n`;
    if (date)     extra += `*Data do Evento:* ${date}\n`;
    if (location) extra += `*Local:* ${location}\n`;
    extra += `*Já tem local:* ${checked('has-venue')}\n`;
  }

  if (service === 'feiras_stands') {
    const area = val('fair-area'), date = formatDate(val('fair-date')), location = val('fair-location'), solic = val('fair-solicitation');
    if (area)     extra += `*Área em m²:* ${area}\n`;
    if (date)     extra += `*Data do Evento:* ${date}\n`;
    if (location) extra += `*Local:* ${location}\n`;
    extra += `*Já tem local:* ${checked('has-venue-fair')}\n`;
    if (solic)    extra += `*Tipo de Solicitação:* ${solicitacaoLabels[solic] || solic}\n`;
  }

  if (service === 'producao_audiovisual') {
    const date = formatDate(val('av-date')), solic = val('av-solicitation'), location = val('av-location');
    if (date)     extra += `*Data do Evento:* ${date}\n`;
    if (solic)    extra += `*Tipo de Solicitação:* ${solicitacaoLabels[solic] || solic}\n`;
    if (location) extra += `*Local:* ${location}\n`;
    extra += `*Já tem local:* ${checked('has-venue-av')}\n`;
  }

  const msg =
    `*Orçamento - DC Produções*\n\n` +
    `*Nome:* ${name}\n` +
    `*Empresa/Evento:* ${company || 'Não informado'}\n` +
    `*Tipo de Serviço:* ${serviceLabels[service] || service}\n` +
    (extra ? `\n${extra}` : '') +
    `*Orçamento Disponível:* ${budget || 'Não informado'}`;

  window.open(`https://wa.me/5511965723939?text=${encodeURIComponent(msg)}`, '_blank');

  feedback.textContent = '✓ Abrindo WhatsApp... você será direcionado para enviar sua solicitação.';
  feedback.className = 'form-feedback success';

  setTimeout(function () {
    document.getElementById('contactForm').reset();
    ['fields-evento', 'fields-feiras', 'fields-audiovisual'].forEach(function (id) {
      const el = document.getElementById(id);
      el.style.display = 'none';
      el.classList.remove('visible');
    });
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  }, 2000);
});
