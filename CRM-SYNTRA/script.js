/* ═══════════════════════════════════════════════════
   SYNTRA PROFESSIONAL CRM — SCRIPT CORE v1.2
   Base Oficial Syntra Digital
   
   ARQUITETURA FUTURA:
   [SUPABASE-AUTH]    → fazerLogin() → supabase.auth.signInWithPassword()
   [SUPABASE-DB]      → DB.get/set   → supabase.from('tabela').select/insert/update
   [SUPABASE-STORAGE] → _addArquivo()→ supabase.storage.from('bucket').upload()
   [EMPRESA-ID]       → Adicionar STATE.empresaId para multiempresa
   [PERMISSOES]       → Adicionar STATE.permissoes para RBAC
   Demo: tudo em localStorage, chaves prefixadas por userId+nicho.
═══════════════════════════════════════════════════ */
'use strict';

/* ═══════════════ CONFIG ═══════════════ */
const CONFIG = {
  supabaseUrl: null,
  supabaseKey: null,
  usuariosDemo: {
    'DEMO-CRM':   { nome: 'Demo Syntra' },
    'MEDICO01':   { nome: 'Dr. Carlos Silva' },
    'CORRETOR01': { nome: 'Marcos Lima' },
    'ADVOGADO01': { nome: 'Dra. Fernanda Costa' },
  }
};

/* ═══════════════ NICHOS ═══════════════ */
const NICHOS = [
  { id:'corretor',        nome:'Corretor de Imóveis',    icone:'🏠', sub:'Imóveis'   },
  { id:'imobiliaria',     nome:'Imobiliária',             icone:'🏢', sub:'Equipe'    },
  { id:'dentista',        nome:'Dentista',                icone:'🦷', sub:'Saúde'     },
  { id:'clinica_odonto',  nome:'Clínica Odontológica',    icone:'🏥', sub:'Saúde'     },
  { id:'psicologo',       nome:'Psicólogo',               icone:'🧠', sub:'Saúde'     },
  { id:'clinica_psico',   nome:'Clínica de Psicologia',   icone:'💆', sub:'Saúde'     },
  { id:'fisio',           nome:'Fisioterapeuta',           icone:'💪', sub:'Saúde'     },
  { id:'clinica_fisio',   nome:'Clínica de Fisioterapia', icone:'🏋️', sub:'Saúde'    },
  { id:'esteticista',     nome:'Esteticista',              icone:'💅', sub:'Beleza'    },
  { id:'clinica_estetica',nome:'Clínica de Estética',     icone:'✨', sub:'Beleza'    },
  { id:'advogado',        nome:'Advogado',                 icone:'⚖️', sub:'Jurídico'  },
  { id:'escritorio',      nome:'Escritório de Advocacia',  icone:'📜', sub:'Jurídico'  },
  { id:'personal',        nome:'Personal Trainer',         icone:'🏃', sub:'Fitness'   },
  { id:'academia',        nome:'Academia',                 icone:'🏋️‍♂️', sub:'Fitness' },
  { id:'barbeiro',        nome:'Barbeiro',                 icone:'✂️', sub:'Barbearia' },
  { id:'barbearia',       nome:'Barbearia',                icone:'💈', sub:'Barbearia' },
  { id:'escola',          nome:'Escola / Curso',           icone:'🎓', sub:'Educação'  },
  { id:'otica',           nome:'Ótica',                    icone:'👓', sub:'Varejo'    },
  { id:'autopecas',       nome:'Auto Peças / Moto Peças',  icone:'🔧', sub:'Varejo'    },
  { id:'farmacia',        nome:'Farmácia',                  icone:'💊', sub:'Saúde'     },
  { id:'borracharia',     nome:'Borracharia',               icone:'🚗', sub:'Serviços'  },
  { id:'loja_celular',    nome:'Loja de Celular',           icone:'📱', sub:'Varejo'    },
  { id:'confeitaria',     nome:'Confeitaria / Casa de Bolo',icone:'🎂', sub:'Alimentação'},
  { id:'acougue',         nome:'Açougue',                   icone:'🥩', sub:'Alimentação'},
  { id:'acai',            nome:'Açaí / Lanchonete',         icone:'🍧', sub:'Alimentação'},
];


/* ═══════════════ CONFIG POR NICHO ═══════════════ */
const NICHO_CONFIG = {
  default: {
    clienteLabel:'Cliente', clientesLabel:'Clientes',
    atendLabel:'Atendimento', atendimentosLabel:'Atendimentos',
    timelineTypes:['Contato Inicial','Atendimento','Nota','Proposta','Follow-up'],
    menus:['Dashboard','Clientes','Agenda','Tarefas','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1,
    statusOptions:['Ativo','Pendente','Inativo','Novo','Concluído'],
    documentos:['Ficha Cadastral','Relatório de Atendimento','Histórico Completo','Termo de Autorização','Proposta Comercial','Recibo','Contrato Simples','Comprovante de Agendamento'],
    kpis:[
      {label:'Total',    icone:'👥', cor:'blue',   campo:'totalClientes'},
      {label:'Ativos',   icone:'✅', cor:'green',  campo:'ativos'},
      {label:'Novos',    icone:'⭐', cor:'gold',   campo:'novos'},
      {label:'Receita',  icone:'💰', cor:'purple', campo:'receita'},
    ]
  },
  corretor:{
    clienteLabel:'Lead',clientesLabel:'Leads',atendLabel:'Contato',atendimentosLabel:'Contatos',
    timelineTypes:['Primeiro Contato','Imóvel de Interesse','Visita Realizada','Proposta Enviada','Negociação','Fechamento'],
    menus:['Dashboard','Leads','Clientes','Imóveis','Visitas','Propostas','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Novo Lead','Qualificado','Visita Marcada','Proposta','Em Negociação','Fechado','Perdido'],
    documentos:['Ficha do Comprador','Ficha do Vendedor','Simulação de Financiamento','Proposta de Compra','Relatório de Visita','Lista de Imóveis de Interesse','Contrato Simples','Comprovante de Agendamento'],
    kpis:[{label:'Leads',icone:'🏠',cor:'blue',campo:'totalClientes'},{label:'Visitas',icone:'🚗',cor:'green',campo:'ativos'},{label:'Propostas',icone:'📄',cor:'gold',campo:'novos'},{label:'Comissão',icone:'💰',cor:'purple',campo:'receita'}]
  },
  imobiliaria:{
    clienteLabel:'Lead',clientesLabel:'Leads/Clientes',atendLabel:'Contato',atendimentosLabel:'Contatos',
    timelineTypes:['Captação','Primeiro Contato','Visita','Proposta','Contrato','Conclusão'],
    menus:['Dashboard','Leads','Imóveis','Captações','Visitas','Contratos','Documentos','Financeiro','Relatórios','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Novo','Qualificado','Em Processo','Contrato','Concluído','Perdido'],
    documentos:['Ficha do Comprador','Ficha do Vendedor','Proposta de Compra','Relatório de Visita','Simulação de Financiamento','Lista de Imóveis','Contrato Simples'],
    kpis:[{label:'Leads',icone:'👥',cor:'blue',campo:'totalClientes'},{label:'Em Negociação',icone:'🤝',cor:'green',campo:'ativos'},{label:'Imóveis',icone:'🏘️',cor:'gold',campo:'novos'},{label:'VGV',icone:'💰',cor:'purple',campo:'receita'}]
  },
  dentista:{
    clienteLabel:'Paciente',clientesLabel:'Pacientes',atendLabel:'Consulta',atendimentosLabel:'Consultas',
    timelineTypes:['Consulta Inicial','Plano de Tratamento','Procedimento Realizado','Retorno','Observação Clínica'],
    menus:['Dashboard','Pacientes','Consultas','Tratamentos','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Retorno Pendente','Em Tratamento','Alta','Aguardando'],
    documentos:['Ficha do Paciente','Anamnese','Plano de Tratamento','Resumo de Consulta','Modelo de Prescrição (Editável)','Encaminhamento','Evolução do Paciente','Comprovante de Agendamento'],
    kpis:[{label:'Pacientes',icone:'🦷',cor:'blue',campo:'totalClientes'},{label:'Em Tratamento',icone:'💊',cor:'green',campo:'ativos'},{label:'Retornos',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  clinica_odonto:{
    clienteLabel:'Paciente',clientesLabel:'Pacientes',atendLabel:'Consulta',atendimentosLabel:'Consultas',
    timelineTypes:['Consulta','Plano de Tratamento','Procedimento','Retorno','Observação'],
    menus:['Dashboard','Pacientes','Consultas','Dentistas','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Tratamento','Retorno Pendente','Alta'],
    documentos:['Ficha do Paciente','Anamnese','Plano de Tratamento','Resumo de Consulta','Modelo de Prescrição (Editável)','Encaminhamento','Evolução do Paciente'],
    kpis:[{label:'Pacientes',icone:'🦷',cor:'blue',campo:'totalClientes'},{label:'Em Tratamento',icone:'💊',cor:'green',campo:'ativos'},{label:'Consultas',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  psicologo:{
    clienteLabel:'Paciente',clientesLabel:'Pacientes',atendLabel:'Sessão',atendimentosLabel:'Sessões',
    timelineTypes:['Sessão Realizada','Resumo da Sessão','Evolução Percebida','Plano Terapêutico','Próxima Sessão'],
    menus:['Dashboard','Pacientes','Sessões','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Acompanhamento','Pausado','Alta','Aguardando'],
    documentos:['Ficha do Paciente','Anamnese','Plano de Acompanhamento','Resumo de Consulta','Evolução do Paciente','Encaminhamento','Termo de Autorização'],
    kpis:[{label:'Pacientes',icone:'🧠',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Sessões',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  clinica_psico:{
    clienteLabel:'Paciente',clientesLabel:'Pacientes',atendLabel:'Sessão',atendimentosLabel:'Sessões',
    timelineTypes:['Sessão','Evolução','Plano','Anotação','Retorno'],
    menus:['Dashboard','Pacientes','Sessões','Psicólogos','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Acompanhamento','Pausado','Alta'],
    documentos:['Ficha do Paciente','Anamnese','Plano de Acompanhamento','Evolução do Paciente','Encaminhamento','Termo de Autorização'],
    kpis:[{label:'Pacientes',icone:'💆',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Sessões',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  fisio:{
    clienteLabel:'Paciente',clientesLabel:'Pacientes',atendLabel:'Sessão',atendimentosLabel:'Sessões',
    timelineTypes:['Avaliação Inicial','Sessão Realizada','Evolução','Plano de Sessões','Retorno'],
    menus:['Dashboard','Pacientes','Avaliações','Sessões','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Tratamento','Retorno','Alta','Aguardando'],
    documentos:['Ficha do Paciente','Anamnese','Plano de Acompanhamento','Resumo de Consulta','Evolução do Paciente','Encaminhamento','Termo de Autorização'],
    kpis:[{label:'Pacientes',icone:'💪',cor:'blue',campo:'totalClientes'},{label:'Em Tratamento',icone:'🏋️',cor:'green',campo:'ativos'},{label:'Sessões',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  clinica_fisio:{
    clienteLabel:'Paciente',clientesLabel:'Pacientes',atendLabel:'Sessão',atendimentosLabel:'Sessões',
    timelineTypes:['Avaliação','Sessão','Evolução','Plano','Retorno'],
    menus:['Dashboard','Pacientes','Fisioterapeutas','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Tratamento','Retorno','Alta'],
    documentos:['Ficha do Paciente','Anamnese','Plano de Acompanhamento','Evolução do Paciente','Encaminhamento','Termo de Autorização'],
    kpis:[{label:'Pacientes',icone:'🏋️',cor:'blue',campo:'totalClientes'},{label:'Em Tratamento',icone:'💪',cor:'green',campo:'ativos'},{label:'Sessões',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  esteticista:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Sessão',atendimentosLabel:'Sessões',
    timelineTypes:['Avaliação','Procedimento','Sessão','Antes e Depois','Retorno'],
    menus:['Dashboard','Clientes','Avaliações','Procedimentos','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Tratamento','Retorno Pendente','Novo','Concluído'],
    documentos:['Ficha da Cliente','Anamnese Estética','Termo de Consentimento','Plano de Sessões','Registro Antes e Depois','Orientações Pós-Procedimento','Comprovante de Agendamento'],
    kpis:[{label:'Clientes',icone:'💅',cor:'blue',campo:'totalClientes'},{label:'Em Tratamento',icone:'✨',cor:'green',campo:'ativos'},{label:'Procedimentos',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  clinica_estetica:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Sessão',atendimentosLabel:'Sessões',
    timelineTypes:['Avaliação','Procedimento','Sessão','Registro Visual','Retorno'],
    menus:['Dashboard','Clientes','Procedimentos','Especialistas','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Tratamento','Retorno','Novo','Concluído'],
    documentos:['Ficha da Cliente','Anamnese Estética','Termo de Consentimento','Plano de Sessões','Orientações Pós-Procedimento','Comprovante de Agendamento'],
    kpis:[{label:'Clientes',icone:'✨',cor:'blue',campo:'totalClientes'},{label:'Em Tratamento',icone:'💆',cor:'green',campo:'ativos'},{label:'Sessões',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  advogado:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Atendimento',atendimentosLabel:'Atendimentos',
    timelineTypes:['Análise Inicial','Documentos Recebidos','Prazo Processual','Audiência','Petição','Andamento'],
    menus:['Dashboard','Clientes','Casos','Prazos','Audiências','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Andamento','Aguardando Docs','Audiência Marcada','Concluído','Arquivado'],
    documentos:['Ficha do Cliente','Resumo do Caso','Checklist de Documentos','Procuração Modelo','Contrato de Honorários','Relatório de Andamento','Ficha Cadastral'],
    kpis:[{label:'Clientes',icone:'⚖️',cor:'blue',campo:'totalClientes'},{label:'Casos Ativos',icone:'📁',cor:'green',campo:'ativos'},{label:'Prazos',icone:'⏰',cor:'gold',campo:'novos'},{label:'Honorários',icone:'💰',cor:'purple',campo:'receita'}]
  },
  escritorio:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Atendimento',atendimentosLabel:'Atendimentos',
    timelineTypes:['Análise','Documentos','Prazo','Audiência','Petição','Conclusão'],
    menus:['Dashboard','Clientes','Casos','Advogados','Prazos','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Andamento','Concluído','Arquivado'],
    documentos:['Ficha do Cliente','Resumo do Caso','Checklist de Documentos','Procuração Modelo','Contrato de Honorários','Relatório de Andamento'],
    kpis:[{label:'Clientes',icone:'⚖️',cor:'blue',campo:'totalClientes'},{label:'Casos Ativos',icone:'📁',cor:'green',campo:'ativos'},{label:'Audiências',icone:'🏛️',cor:'gold',campo:'novos'},{label:'Honorários',icone:'💰',cor:'purple',campo:'receita'}]
  },
  personal:{
    clienteLabel:'Aluno',clientesLabel:'Alunos',atendLabel:'Treino',atendimentosLabel:'Treinos',
    timelineTypes:['Avaliação Física','Objetivo Definido','Treino Realizado','Evolução','Renovação'],
    menus:['Dashboard','Alunos','Avaliações','Treinos','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Pausado','Novo','Renovação Pendente','Inativo'],
    documentos:['Ficha de Aluno','Avaliação Física','Ficha de Treino','Plano Semanal','Evolução Corporal','Termo de Responsabilidade','Comprovante de Agendamento'],
    kpis:[{label:'Alunos',icone:'🏃',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Treinos',icone:'🏋️',cor:'gold',campo:'novos'},{label:'Mensalidades',icone:'💰',cor:'purple',campo:'receita'}]
  },
  academia:{
    clienteLabel:'Aluno',clientesLabel:'Alunos',atendLabel:'Aula',atendimentosLabel:'Aulas',
    timelineTypes:['Matrícula','Avaliação','Treino','Evolução','Renovação'],
    menus:['Dashboard','Alunos','Avaliações','Instrutores','Planos','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Pausado','Novo','Vencido','Cancelado'],
    documentos:['Ficha de Aluno','Avaliação Física','Ficha de Treino','Plano Semanal','Evolução Corporal','Termo de Responsabilidade'],
    kpis:[{label:'Alunos',icone:'🏋️‍♂️',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Novos',icone:'⭐',cor:'gold',campo:'novos'},{label:'Mensalidades',icone:'💰',cor:'purple',campo:'receita'}]
  },
  barbeiro:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Atendimento',atendimentosLabel:'Atendimentos',
    timelineTypes:['Primeiro Corte','Serviço Realizado','Preferência','Retorno Sugerido'],
    menus:['Dashboard','Clientes','Agendamentos','Serviços','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Retorno Pendente','Novo','Inativo'],
    documentos:['Ficha do Cliente','Histórico de Cortes','Preferências do Cliente','Comprovante de Agendamento'],
    kpis:[{label:'Clientes',icone:'✂️',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Atendimentos',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  barbearia:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Atendimento',atendimentosLabel:'Atendimentos',
    timelineTypes:['Agendamento','Serviço','Preferência','Retorno'],
    menus:['Dashboard','Clientes','Agendamentos','Barbeiros','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Novo','Retorno','Inativo'],
    documentos:['Ficha do Cliente','Histórico de Cortes','Preferências do Cliente','Comprovante de Agendamento'],
    kpis:[{label:'Clientes',icone:'💈',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Atendimentos',icone:'📅',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  escola:{
    clienteLabel:'Aluno',clientesLabel:'Alunos',atendLabel:'Aula',atendimentosLabel:'Aulas',
    timelineTypes:['Matrícula','Aula','Avaliação','Observação','Conclusão'],
    menus:['Dashboard','Alunos','Turmas','Professores','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Trancado','Novo','Concluído','Inadimplente'],
    documentos:['Ficha de Aluno','Certificado de Conclusão','Histórico Escolar','Declaração de Matrícula','Relatório do Professor','Ficha Cadastral','Comprovante de Pagamento'],
    kpis:[{label:'Alunos',icone:'🎓',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Matrículas',icone:'📋',cor:'gold',campo:'novos'},{label:'Mensalidades',icone:'💰',cor:'purple',campo:'receita'}]
  },
  otica:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Atendimento',atendimentosLabel:'Atendimentos',
    timelineTypes:['Primeiro Atendimento','Exame de Vista','Pedido','Entrega','Retorno'],
    menus:['Dashboard','Clientes','Pedidos','Estoque','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Pedido em Andamento','Aguardando Retirada','Concluído'],
    documentos:['Ficha do Cliente','Receita de Óculos','Pedido de Lentes','Comprovante de Entrega','Ficha Cadastral','Recibo'],
    kpis:[{label:'Clientes',icone:'👓',cor:'blue',campo:'totalClientes'},{label:'Pedidos',icone:'📦',cor:'green',campo:'ativos'},{label:'Novos',icone:'⭐',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  autopecas:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Atendimento',atendimentosLabel:'Atendimentos',
    timelineTypes:['Primeiro Atendimento','Orçamento','Pedido','Entrega','Retorno'],
    menus:['Dashboard','Clientes','Orçamentos','Pedidos','Estoque','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Orçamento','Pedido Aberto','Concluído'],
    documentos:['Ficha do Cliente','Orçamento','Pedido de Compra','Comprovante de Entrega','Recibo','Ficha Cadastral'],
    kpis:[{label:'Clientes',icone:'🔧',cor:'blue',campo:'totalClientes'},{label:'Pedidos',icone:'📦',cor:'green',campo:'ativos'},{label:'Orçamentos',icone:'📋',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  farmacia:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Atendimento',atendimentosLabel:'Atendimentos',
    timelineTypes:['Cadastro','Compra','Receituário','Retorno','Observação'],
    menus:['Dashboard','Clientes','Vendas','Estoque','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Novo','Recorrente'],
    documentos:['Ficha do Cliente','Ficha Cadastral','Recibo','Comprovante de Compra','Histórico de Compras'],
    kpis:[{label:'Clientes',icone:'💊',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Novos',icone:'⭐',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  borracharia:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Serviço',atendimentosLabel:'Serviços',
    timelineTypes:['Atendimento','Serviço Realizado','Orçamento','Retorno'],
    menus:['Dashboard','Clientes','Orçamentos','Serviços','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Serviço','Aguardando','Concluído'],
    documentos:['Ficha do Cliente','Ordem de Serviço','Orçamento','Recibo','Comprovante de Serviço'],
    kpis:[{label:'Clientes',icone:'🚗',cor:'blue',campo:'totalClientes'},{label:'Em Serviço',icone:'🔧',cor:'green',campo:'ativos'},{label:'Orçamentos',icone:'📋',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  loja_celular:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Atendimento',atendimentosLabel:'Atendimentos',
    timelineTypes:['Primeiro Atendimento','Orçamento','Compra','Assistência Técnica','Entrega'],
    menus:['Dashboard','Clientes','Vendas','Orçamentos','Estoque','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Em Orçamento','Em Reparo','Concluído'],
    documentos:['Ficha do Cliente','Ordem de Serviço','Orçamento','Recibo','Comprovante de Entrega','Ficha Cadastral'],
    kpis:[{label:'Clientes',icone:'📱',cor:'blue',campo:'totalClientes'},{label:'Em Reparo',icone:'🔧',cor:'green',campo:'ativos'},{label:'Orçamentos',icone:'📋',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  confeitaria:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Pedido',atendimentosLabel:'Pedidos',
    timelineTypes:['Pedido Recebido','Confirmação','Produção','Entrega','Retorno'],
    menus:['Dashboard','Clientes','Pedidos','Cardápio','Agenda','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Novo Pedido','Em Produção','Pronto','Entregue','Cancelado'],
    documentos:['Ficha do Cliente','Pedido Personalizado','Comprovante de Pedido','Recibo','Ficha Cadastral'],
    kpis:[{label:'Clientes',icone:'🎂',cor:'blue',campo:'totalClientes'},{label:'Em Produção',icone:'👨‍🍳',cor:'green',campo:'ativos'},{label:'Pedidos',icone:'📦',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  acougue:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Venda',atendimentosLabel:'Vendas',
    timelineTypes:['Cadastro','Venda','Pedido','Entrega','Retorno'],
    menus:['Dashboard','Clientes','Vendas','Estoque','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Novo','Recorrente'],
    documentos:['Ficha do Cliente','Pedido','Recibo','Comprovante de Entrega','Ficha Cadastral'],
    kpis:[{label:'Clientes',icone:'🥩',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Novos',icone:'⭐',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
  acai:{
    clienteLabel:'Cliente',clientesLabel:'Clientes',atendLabel:'Pedido',atendimentosLabel:'Pedidos',
    timelineTypes:['Pedido','Entrega','Retorno'],
    menus:['Dashboard','Clientes','Pedidos','Cardápio','Documentos','Financeiro','IA','Importar','Config'],
    menuListagemIdx:1, statusOptions:['Ativo','Novo','Recorrente','Delivery'],
    documentos:['Ficha do Cliente','Pedido','Recibo','Comprovante de Entrega'],
    kpis:[{label:'Clientes',icone:'🍧',cor:'blue',campo:'totalClientes'},{label:'Ativos',icone:'✅',cor:'green',campo:'ativos'},{label:'Pedidos',icone:'📦',cor:'gold',campo:'novos'},{label:'Receita',icone:'💰',cor:'purple',campo:'receita'}]
  },
};


/* ═══════════════ DADOS DEMO ═══════════════ */
const DEMO_CLIENTES_BASE = {
  corretor:[
    {nome:'Marcos Lima',telefone:'(11)98765-4321',whatsapp:'11987654321',email:'marcos@email.com',cidade:'São Paulo',tipo_imovel:'Apartamento 3 quartos',faixa_valor:'R$ 500-700k',financiamento:'Sim',status:'Visita Marcada',origem:'Instagram',responsavel:'Ana Corretora',obs:'Cliente com urgência. Quer reformar.'},
    {nome:'Priscila Mendes',telefone:'(11)91234-5678',whatsapp:'11912345678',email:'priscila@email.com',cidade:'Campinas',tipo_imovel:'Casa térrea',faixa_valor:'R$ 350-450k',financiamento:'Não',status:'Novo Lead',origem:'Indicação',responsavel:'Carlos Corretor',obs:'Busca imóvel com quintal.'},
  ],
  dentista:[
    {nome:'Ana Souza',telefone:'(21)98888-7777',whatsapp:'21988887777',email:'ana@email.com',cidade:'Rio de Janeiro',tratamento:'Clareamento + Restauração',plano_trat:'3 sessões previstas',retorno:'15/07/2026',status:'Retorno Pendente',responsavel:'Dr. Carlos',obs:'Sensibilidade pós clareamento.'},
    {nome:'Roberto Nunes',telefone:'(21)97777-6666',whatsapp:'21977776666',email:'roberto@email.com',cidade:'Rio de Janeiro',tratamento:'Implante',plano_trat:'Implante unit. dente 24',retorno:'20/07/2026',status:'Em Tratamento',responsavel:'Dr. Carlos',obs:'Aguardando exame de imagem.'},
    {nome:'Luana Ferreira',telefone:'(21)96666-5555',whatsapp:'21966665555',email:'luana@email.com',cidade:'Niterói',tratamento:'Ortodontia',plano_trat:'Aparelho fixo 18 meses',retorno:'01/08/2026',status:'Ativo',responsavel:'Dra. Paula',obs:'Ajuste realizado.'},
  ],
  psicologo:[
    {nome:'Laura Mendes',telefone:'(11)95555-4444',whatsapp:'11955554444',email:'laura@email.com',cidade:'São Paulo',proxima_sessao:'12/06/2026',status:'Em Acompanhamento',responsavel:'Dra. Beatriz',obs:'Processo de luto. Progressos.'},
    {nome:'Pedro Alves',telefone:'(11)94444-3333',whatsapp:'11944443333',email:'pedro@email.com',cidade:'São Paulo',proxima_sessao:'18/06/2026',status:'Ativo',responsavel:'Dra. Beatriz',obs:'Ansiedade. TCC.'},
  ],
  advogado:[
    {nome:'Renato Alves',telefone:'(11)93333-2222',whatsapp:'11933332222',email:'renato@email.com',cidade:'São Paulo',area_juridica:'Trabalhista',resumo_caso:'Rescisão indireta + horas extras',prazo:'30/06/2026',honorarios:'R$ 3.500,00',status:'Aguardando Docs',responsavel:'Dr. Marcos',obs:'Documentos pendentes.'},
    {nome:'Catarina Braga',telefone:'(11)92222-1111',whatsapp:'11922221111',email:'catarina@email.com',cidade:'Campinas',area_juridica:'Família',resumo_caso:'Divórcio consensual + guarda',prazo:'15/07/2026',honorarios:'R$ 2.200,00',status:'Em Andamento',responsavel:'Dra. Fernanda',obs:'Audiência marcada para agosto.'},
  ],
  esteticista:[
    {nome:'Juliana Costa',telefone:'(11)91111-0000',whatsapp:'11911110000',email:'juliana@email.com',cidade:'São Paulo',procedimento:'Limpeza de pele + Peeling',sessoes_prev:'4 sessões',retorno:'20/06/2026',orcamento:'R$ 480,00',status:'Em Tratamento',responsavel:'Marta',obs:'Pele sensível.'},
  ],
  personal:[
    {nome:'Thiago Barros',telefone:'(11)90000-9999',whatsapp:'11900009999',email:'thiago@email.com',cidade:'São Paulo',objetivo:'Hipertrofia',peso:'82kg',altura:'1.78m',meta:'Ganhar 5kg massa',plano:'ABCDE 5x/semana',status:'Ativo',responsavel:'Prof. Alex',obs:'Evolução excelente.'},
  ],
  barbeiro:[
    {nome:'Diego Martins',telefone:'(11)89999-8888',whatsapp:'11899998888',email:'diego@email.com',cidade:'São Paulo',servico_pref:'Corte + Barba',ultimo_corte:'01/06/2026',barbeiro_resp:'Ricardo',retorno_sug:'15/06/2026',status:'Retorno Pendente',obs:'Degradê baixo.'},
    {nome:'Lucas Vieira',telefone:'(11)88888-7777',whatsapp:'11888887777',email:'lucas@email.com',cidade:'São Paulo',servico_pref:'Corte Navalhado',ultimo_corte:'28/05/2026',barbeiro_resp:'João',retorno_sug:'11/06/2026',status:'Ativo',obs:'Cliente VIP.'},
  ],
};

/* ═══════════════ STATE ═══════════════ */
const STATE = {
  userId: null, userName: null, tipoConta: null, nichoId: null,
  moduloAtivo: 'Dashboard', clienteAbertoId: null,
};

/* ═══════════════ DB ═══════════════ */
const DB = {
  _key: (t)  => `syntra_crm_${STATE.userId}_${STATE.nichoId||'default'}_${t}`,
  _keyUser: (c) => `syntra_crm_${STATE.userId}_${c}`,
  _get(k)    { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  _set(k,v)  { try { localStorage.setItem(k,JSON.stringify(v)); } catch(e){ console.warn('[DB]',e); } },
  _del(k)    { localStorage.removeItem(k); },

  getClientes()         { return this._get(this._key('clientes')) || []; },
  setClientes(a)        { this._set(this._key('clientes'), a); },
  getTimeline(cid)      { return this._get(this._key('tl_'+cid)) || []; },
  setTimeline(cid,a)    { this._set(this._key('tl_'+cid), a); },
  getTarefas()          { return this._get(this._key('tarefas')) || []; },
  setTarefas(a)         { this._set(this._key('tarefas'), a); },
  getAgenda()           { return this._get(this._key('agenda')) || []; },
  setAgenda(a)          { this._set(this._key('agenda'), a); },
  getFinanceiro()       { return this._get(this._key('financeiro')) || []; },
  setFinanceiro(a)      { this._set(this._key('financeiro'), a); },
  getDocumentos(cid)    { return this._get(this._key('docs_'+cid)) || []; },
  setDocumentos(cid,a)  { this._set(this._key('docs_'+cid), a); },
  isInicializado()      { return !!this._get(this._key('init_v2')); },
  marcarInicializado()  { this._set(this._key('init_v2'), true); },
  getTipoConta()        { return this._get(this._keyUser('tipoConta')); },
  setTipoConta(v)       { this._set(this._keyUser('tipoConta'), v); },
  getNichoId()          { return this._get(this._keyUser('nichoId')); },
  setNichoId(v)         { this._set(this._keyUser('nichoId'), v); },
  getNome()             { return this._get(this._keyUser('nome')); },
  setNome(v)            { this._set(this._keyUser('nome'), v); },
  resetNicho() {
    const base = this._key('');
    Object.keys(localStorage).filter(k => k.startsWith(base)).forEach(k => localStorage.removeItem(k));
  },
};

/* ═══════════════ HELPERS ═══════════════ */
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2,5); }
function toast(msg, tipo='info') {
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg; el.className = `toast ${tipo}`;
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.add('hidden'), 3200);
}
function getNichoConf() { return Object.assign({}, NICHO_CONFIG.default, NICHO_CONFIG[STATE.nichoId]||{}); }
function getNichoInfo() { return NICHOS.find(n => n.id === STATE.nichoId) || NICHOS[2]; }
function formatDate()   { return new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
function setScreen(id)  { document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); const el=document.getElementById(id); if(el) el.classList.add('active'); }
function icon(path,size=16) { return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${path}</svg>`; }
function getMenuListagem() { const c=getNichoConf(); return c.menus[c.menuListagemIdx||1]||'Clientes'; }


const ICONS = {
  dashboard: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  clientes:  '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  agenda:    '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  financeiro:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
  ia:        '<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>',
  tarefas:   '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
  config:    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  importar:  '<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>',
  leads:     '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3-8.59A2 2 0 012.11 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.39a16 16 0 006.72 6.72l.75-.75a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0121 17l.92-.08z"/>',
  imoveis:   '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  casos:     '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  doc:       '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
};
const MENU_ICONS = {
  'Dashboard':ICONS.dashboard,'Leads':ICONS.leads,'Clientes':ICONS.clientes,'Pacientes':ICONS.clientes,
  'Alunos':ICONS.clientes,'Agenda':ICONS.agenda,'Financeiro':ICONS.financeiro,'IA':ICONS.ia,
  'Tarefas':ICONS.tarefas,'Config':ICONS.config,'Importar':ICONS.importar,'Imóveis':ICONS.imoveis,
  'Casos':ICONS.casos,'Sessões':ICONS.agenda,'Treinos':ICONS.tarefas,'Agendamentos':ICONS.agenda,
  'Consultas':ICONS.agenda,'Tratamentos':ICONS.tarefas,'Retornos':ICONS.agenda,'Avaliações':ICONS.tarefas,
  'Propostas':ICONS.casos,'Contratos':ICONS.casos,'Prazos':ICONS.agenda,'Documentos':ICONS.doc,
  'Audiências':ICONS.agenda,'Honorários':ICONS.financeiro,'Mensalidades':ICONS.financeiro,
  'Procedimentos':ICONS.tarefas,'Orçamentos':ICONS.financeiro,'Corretores':ICONS.clientes,
  'Dentistas':ICONS.clientes,'Barbeiros':ICONS.clientes,'Instrutores':ICONS.clientes,
  'Psicólogos':ICONS.clientes,'Advogados':ICONS.clientes,'Especialistas':ICONS.clientes,
  'Fisioterapeutas':ICONS.clientes,'Evolução':ICONS.tarefas,'Captações':ICONS.imoveis,
  'Visitas':ICONS.agenda,'Comissões':ICONS.financeiro,'Relatórios':ICONS.dashboard,
  'Planos':ICONS.casos,'Histórico':ICONS.tarefas,'Serviços':ICONS.tarefas,
  'Antes e Depois':ICONS.tarefas,'Turmas':ICONS.clientes,'Professores':ICONS.clientes,
  'Vendas':ICONS.financeiro,'Estoque':ICONS.casos,'Pedidos':ICONS.casos,'Cardápio':ICONS.casos,
};


/* ═══════════════════════════════════════════════════
   SYNTRA CRM — OBJETO PRINCIPAL
═══════════════════════════════════════════════════ */
const SyntraCRM = {

  /* ──── LOGIN ──── */
  fazerLogin() {
    const mat = (document.getElementById('login-matricula')?.value||'').trim();
    STATE.userId   = mat || 'DEMO';
    const conf     = CONFIG.usuariosDemo[STATE.userId];
    STATE.userName = DB.getNome() || (conf ? conf.nome : (mat||'Usuário Demo'));
    ['topbar-avatar','sidebar-avatar'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent=STATE.userName.charAt(0).toUpperCase(); });
    const un=document.getElementById('sidebar-username'); if(un) un.textContent=STATE.userName;
    const tipoPersistido=DB.getTipoConta(), nichoPersistido=DB.getNichoId();
    if(tipoPersistido && nichoPersistido) { STATE.tipoConta=tipoPersistido; STATE.nichoId=nichoPersistido; SyntraCRM._entrarNoCRM(); }
    else setScreen('screen-tipoconta');
  },

  toggleSenha() { const i=document.getElementById('login-senha'); if(i) i.type=i.type==='password'?'text':'password'; },

  /* ──── TIPO CONTA ──── */
  selecionarTipo(tipo) { STATE.tipoConta=tipo; DB.setTipoConta(tipo); SyntraCRM._renderizarNichoGrid(); setScreen('screen-nicho'); },

  /* ──── NICHO ──── */
  _renderizarNichoGrid() {
    const g=document.getElementById('nicho-grid'); if(!g) return;
    g.innerHTML=NICHOS.map(n=>`<div class="nicho-card" onclick="SyntraCRM.selecionarNicho('${n.id}')"><span class="n-icon">${n.icone}</span><span class="n-name">${n.nome}</span><span class="n-sub">${n.sub}</span></div>`).join('');
  },

  selecionarNicho(nichoId) { STATE.nichoId=nichoId; DB.setNichoId(nichoId); SyntraCRM._entrarNoCRM(); },

  _entrarNoCRM() {
    const info=getNichoInfo(); const conf=getNichoConf();
    const sl=document.getElementById('sidebar-nicho-label'); if(sl) sl.textContent=info.nome;
    const tn=document.getElementById('topbar-nicho-badge'); if(tn) tn.textContent=info.icone+' '+info.nome;
    const st=document.getElementById('sidebar-tipo-label'); if(st) st.textContent=`${STATE.tipoConta} · ${STATE.userName.split(' ')[0]}`;
    document.title=`Syntra CRM · ${info.nome}`;
    if(!DB.isInicializado()){ SyntraCRM._inicializarDemoData(); DB.marcarInicializado(); }
    SyntraCRM._renderizarSidebar(); SyntraCRM.navegarPara('Dashboard'); setScreen('screen-crm');
  },

  trocarNicho() { STATE.nichoId=null; DB.setNichoId(null); setScreen('screen-nicho'); },

  /* ──── SIDEBAR ──── */
  _renderizarSidebar() {
    const conf=getNichoConf(); const menus=conf.menus||NICHO_CONFIG.default.menus;
    const nav=document.getElementById('sidebar-nav'); if(!nav) return;
    nav.innerHTML=`<div class="nav-section"><div class="nav-label">Menu Principal</div>${menus.map(m=>`<div class="nav-item" id="nav-${CSS.escape(m)}" onclick="SyntraCRM.navegarPara('${m.replace(/'/g,"\\'")}')"><span style="flex-shrink:0">${icon(MENU_ICONS[m]||ICONS.dashboard)}</span><span class="nav-text">${m}</span></div>`).join('')}</div>`;
  },

  toggleSidebar() {
    const sb=document.getElementById('sidebar'); if(!sb) return;
    if(window.innerWidth<=900) sb.classList.toggle('mobile-open'); else sb.classList.toggle('collapsed');
  },

  /* ──── NAVEGAÇÃO ──── */
  navegarPara(modulo) {
    STATE.moduloAtivo=modulo;
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
    const navEl=document.getElementById('nav-'+CSS.escape(modulo)); if(navEl) navEl.classList.add('active');
    const bgo=document.getElementById('search-results-overlay'); if(bgo) bgo.classList.add('hidden');
    const bgi=document.getElementById('search-global-input'); if(bgi) bgi.value='';
    const area=document.getElementById('content-area'); if(!area) return;
    const conf=getNichoConf();
    switch(modulo){
      case 'Dashboard':                         area.innerHTML=SyntraCRM._renderDashboard();              break;
      case 'Clientes': case 'Pacientes':
      case 'Alunos':   case 'Leads':            area.innerHTML=SyntraCRM._renderListagem(conf.clientesLabel); break;
      case 'Agenda':   case 'Agendamentos':
      case 'Consultas':                          area.innerHTML=SyntraCRM._renderAgenda();                 break;
      case 'Financeiro': case 'Honorários':
      case 'Mensalidades':                       area.innerHTML=SyntraCRM._renderFinanceiro();             break;
      case 'Tarefas':                            area.innerHTML=SyntraCRM._renderTarefas();               break;
      case 'IA':                                 area.innerHTML=SyntraCRM._renderIA();                    break;
      case 'Importar':                           area.innerHTML=SyntraCRM._renderImportar();              break;
      case 'Config':                             area.innerHTML=SyntraCRM._renderConfig();                break;
      case 'Relatórios':                         area.innerHTML=SyntraCRM._renderRelatorios();            break;
      case 'Documentos':                         area.innerHTML=SyntraCRM._renderDocumentosGlobal();      break;
      default:                                   area.innerHTML=SyntraCRM._renderGenerico(modulo);        break;
    }
    if(window.innerWidth<=900){ const sb=document.getElementById('sidebar'); if(sb) sb.classList.remove('mobile-open'); }
  },


  /* ════════ DASHBOARD ════════ */
  _renderDashboard() {
    const conf=getNichoConf(); const info=getNichoInfo();
    const clientes=DB.getClientes();
    const ativos=clientes.filter(c=>/(ativ|amento)/i.test(c.status||'')).length;
    const novos=clientes.filter(c=>/nov/i.test(c.status||'')).length;
    const fin=DB.getFinanceiro();
    const receitaNum=fin.filter(f=>f.tipo==='receita').reduce((a,b)=>a+(+b.valor||0),0);
    const kpiData={totalClientes:clientes.length,ativos,novos,receita:'R$ '+receitaNum.toLocaleString('pt-BR',{minimumFractionDigits:2})};
    const colors={blue:'var(--blue-light)',green:'var(--green)',gold:'var(--gold-light)',purple:'#a78bfa'};
    const kpisHTML=conf.kpis.map(k=>`<div class="kpi-card"><div class="kpi-header"><span class="kpi-label">${k.label}</span><div class="kpi-icon" style="background:${colors[k.cor]}18">${k.icone}</div></div><div class="kpi-value" style="color:${colors[k.cor]}">${kpiData[k.campo]??0}</div><div class="kpi-delta up">↑ ${Math.floor(Math.random()*18+3)}% mês</div></div>`).join('');
    const atividade=[
      {cor:'blue', text:`Novo ${conf.clienteLabel.toLowerCase()} cadastrado`,time:'há 5 min',status:'Novo',sc:'status-novo'},
      {cor:'green',text:'Atendimento registrado',time:'há 23 min',status:'OK',sc:'status-ativo'},
      {cor:'gold', text:'Retorno agendado',time:'há 1h',status:'Agend.',sc:'status-pendente'},
      {cor:'purple',text:`Documento gerado`,time:'há 2h',status:'Doc.',sc:'status-concluido'},
      {cor:'blue', text:`${conf.clienteLabel} atualizado`,time:'Ontem',status:'Edit.',sc:'status-novo'},
    ];
    return `
      <div class="page-header">
        <div><h1 class="page-title">${info.icone} Dashboard</h1><p class="page-desc">${info.nome} · ${STATE.tipoConta==='PJ'?'Empresa':'Profissional'} · Bem-vindo, ${STATE.userName.split(' ')[0]}!</p></div>
        <div class="page-actions">
          <button class="btn-secondary btn-sm" onclick="SyntraCRM.abrirModalNovoCliente()">${icon('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>')} Novo ${conf.clienteLabel}</button>
        </div>
      </div>
      <div class="kpi-grid">${kpisHTML}</div>
      <div class="dash-grid">
        <div class="card">
          <div class="card-header"><span class="card-title">Atividade Recente</span><span class="tag blue">Hoje</span></div>
          <div class="dash-activity">${atividade.map(a=>`<div class="activity-item"><div class="activity-dot ${a.cor}"></div><div class="activity-main"><div class="activity-text">${a.text}</div><div class="activity-time">${a.time}</div></div><span class="activity-badge-status status ${a.sc}">${a.status}</span></div>`).join('')}</div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Evolução Mensal</span><span class="tag">6 meses</span></div>
          ${SyntraCRM._renderBarChart()}
        </div>
        <div class="card span-2">
          <div class="card-header"><span class="card-title">Pipeline · ${conf.clientesLabel}</span><button class="btn-ghost btn-sm" onclick="SyntraCRM.navegarPara('${getMenuListagem()}')">Ver todos →</button></div>
          ${SyntraCRM._renderMiniPipeline(conf)}
        </div>
      </div>`;
  },

  _renderBarChart() {
    const vals=[28,42,35,58,47,65]; const labels=['Jan','Fev','Mar','Abr','Mai','Jun']; const max=Math.max(...vals);
    return `<div class="bar-chart">${vals.map(v=>`<div class="bar" style="height:${(v/max*100).toFixed(1)}%" data-val="${v}"></div>`).join('')}</div><div class="bar-labels">${labels.map(l=>`<span class="bar-label">${l}</span>`).join('')}</div>`;
  },

  _renderMiniPipeline(conf) {
    const clientes=DB.getClientes(); const stages=(conf.statusOptions||['Novo','Ativo','Pendente','Concluído']).slice(0,4);
    return `<div class="pipeline">${stages.map(stage=>{
      const items=clientes.filter(c=>c.status===stage);
      return `<div class="pipeline-col"><div class="pipeline-col-header"><span class="pipeline-col-title">${stage}</span><span class="pipeline-count">${items.length}</span></div>${items.slice(0,3).map(c=>`<div class="pipeline-item" onclick="SyntraCRM.abrirPerfil('${c.id}')"><div class="pi-name">${c.nome}</div><div class="pi-info">${c.cidade||'—'}</div></div>`).join('')}${items.length===0?`<div class="empty-state" style="padding:.75rem"><span class="empty-desc">Vazio</span></div>`:''}</div>`;
    }).join('')}</div>`;
  },

  /* ════════ LISTAGEM ════════ */
  _renderListagem(titulo) {
    const conf=getNichoConf(); const clientes=DB.getClientes();
    return `
      <div class="page-header">
        <div><h1 class="page-title">${titulo}</h1><p class="page-desc">${clientes.length} registro(s)</p></div>
        <div class="page-actions">
          <button class="btn-primary btn-sm" onclick="SyntraCRM.abrirModalNovoCliente()">${icon('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>')} Novo ${conf.clienteLabel}</button>
          <button class="btn-secondary btn-sm" onclick="SyntraCRM.navegarPara('Importar')">${icon(ICONS.importar)} Importar</button>
        </div>
      </div>
      <div class="search-bar">${icon('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>')}<input type="text" id="busca-local" placeholder="Buscar por nome, telefone, email, status..." oninput="SyntraCRM._filtrarTabela(this.value)"/></div>
      <div class="filters-bar"><span class="filter-chip active" onclick="SyntraCRM._filtrarStatus('',this)">Todos</span>${conf.statusOptions.slice(0,5).map(s=>`<span class="filter-chip" onclick="SyntraCRM._filtrarStatus('${s}',this)">${s}</span>`).join('')}</div>
      <div class="card" style="padding:0"><div class="table-wrap"><table><thead><tr><th>Nome</th><th>Contato</th><th>Cidade</th><th>Status</th><th>Responsável</th><th>Ações</th></tr></thead><tbody id="tbody-clientes">${SyntraCRM._renderLinhasTabela(clientes)}</tbody></table></div></div>`;
  },

  _renderLinhasTabela(clientes) {
    if(!clientes.length) return `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">👥</div><div class="empty-title">Nenhum registro</div><div class="empty-desc">Cadastre ou importe sua base.</div><button class="btn-primary btn-sm mt-2" onclick="SyntraCRM.abrirModalNovoCliente()">Cadastrar agora</button></div></td></tr>`;
    return clientes.map(c=>`<tr><td><div class="td-name"><div class="td-avatar">${(c.nome||'?').charAt(0).toUpperCase()}</div>${c.nome||'—'}</div></td><td>${c.telefone||c.whatsapp||'—'}</td><td>${c.cidade||'—'}</td><td><span class="status ${SyntraCRM._statusClass(c.status)}">${c.status||'—'}</span></td><td>${c.responsavel||'—'}</td><td><div class="td-actions"><button class="btn-icon" title="Ver Perfil" onclick="SyntraCRM.abrirPerfil('${c.id}')">${icon('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',15)}</button><button class="btn-icon" title="Documentos" onclick="SyntraCRM.abrirDocumentosPerfil('${c.id}')">${icon(ICONS.doc,15)}</button><button class="btn-icon" title="Editar" onclick="SyntraCRM.abrirModalEditarCliente('${c.id}')">${icon('<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',15)}</button><button class="btn-icon" title="Excluir" onclick="SyntraCRM.excluirCliente('${c.id}')" style="color:var(--red)">${icon('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>',15)}</button></div></td></tr>`).join('');
  },

  _statusClass(s=''){const l=s.toLowerCase();if(/(ativ|amento|confirmado)/.test(l))return'status-ativo';if(/(pendente|aguard|processo)/.test(l))return'status-pendente';if(/(inati|cancelado|perdido)/.test(l))return'status-inativo';if(/(nov|lead|captado)/.test(l))return'status-novo';if(/(fechado|conclu|alta)/.test(l))return'status-fechado';return'status-pendente';},

  _filtrarTabela(q){const c=DB.getClientes();const f=q?c.filter(x=>Object.values(x).some(v=>String(v).toLowerCase().includes(q.toLowerCase()))):c;const t=document.getElementById('tbody-clientes');if(t)t.innerHTML=SyntraCRM._renderLinhasTabela(f);},
  _filtrarStatus(s,el){document.querySelectorAll('.filter-chip').forEach(e=>e.classList.remove('active'));if(el)el.classList.add('active');const c=DB.getClientes();const f=s?c.filter(x=>x.status===s):c;const t=document.getElementById('tbody-clientes');if(t)t.innerHTML=SyntraCRM._renderLinhasTabela(f);},


  /* ════════ PERFIL DO CLIENTE ════════ */
  abrirPerfil(id) {
    STATE.clienteAbertoId=id;
    const clientes=DB.getClientes(); const c=clientes.find(x=>x.id===id);
    if(!c){toast('Registro não encontrado','error');return;}
    const conf=getNichoConf(); const timeline=DB.getTimeline(id);
    const docs=DB.getDocumentos(id); const ini=(c.nome||'?').charAt(0).toUpperCase();
    document.getElementById('content-area').innerHTML=`
      <div class="page-header">
        <div class="flex items-center gap-2">
          <button class="btn-ghost btn-sm" onclick="SyntraCRM.navegarPara('${getMenuListagem()}')">← Voltar</button>
          <div><h1 class="page-title">${c.nome}</h1><p class="page-desc">${conf.clienteLabel} · <span class="status ${SyntraCRM._statusClass(c.status)}">${c.status||'—'}</span></p></div>
        </div>
        <div class="page-actions">
          <button class="btn-secondary btn-sm" onclick="SyntraCRM.abrirModalEditarCliente('${id}')">Editar</button>
          <button class="btn-primary btn-sm" onclick="SyntraCRM.abrirModalAddTimeline('${id}')">+ ${conf.atendLabel}</button>
          <button class="btn-secondary btn-sm" onclick="SyntraCRM.abrirDocumentosPerfil('${id}')">${icon(ICONS.doc,14)} Documentos</button>
          <button class="btn-ghost btn-sm" onclick="SyntraCRM.exportarPerfil('${id}')">Exportar</button>
        </div>
      </div>
      <div class="profile-layout">
        <div class="profile-sidebar">
          <div class="profile-card">
            <div class="profile-header-bg"></div>
            <div class="profile-avatar-wrap"><div class="profile-avatar-large">${ini}</div></div>
            <div class="profile-info">
              <div class="profile-name">${c.nome}</div>
              <div class="profile-meta">${c.email||''}</div>
              <div class="profile-actions">
                ${c.whatsapp?`<a href="https://wa.me/${c.whatsapp.replace(/\D/g,'')}" target="_blank" rel="noopener" class="btn-primary btn-sm">WhatsApp</a>`:''}
                <button class="btn-secondary btn-sm" onclick="SyntraCRM.abrirModalEditarCliente('${id}')">Editar</button>
              </div>
            </div>
          </div>
          <div class="card" style="padding:0"><div class="info-list">${SyntraCRM._renderInfoRows(c)}</div></div>
          <div class="card">
            <div class="card-header"><span class="card-title">Documentos (${docs.length})</span><button class="btn-primary btn-sm" onclick="SyntraCRM.abrirDocumentosPerfil('${id}')">${icon(ICONS.doc,13)} Gerar</button></div>
            ${docs.length?`<div style="display:flex;flex-direction:column;gap:4px">${docs.slice(0,3).map(d=>`<div class="activity-item" style="cursor:pointer" onclick="SyntraCRM.abrirDocumentosPerfil('${id}')"><div class="activity-dot blue"></div><div class="activity-main"><div class="activity-text fs-sm">${d.tipo}</div><div class="activity-time">${d.data}</div></div></div>`).join('')}</div>`:`<div class="empty-state" style="padding:1rem"><div class="empty-title fs-sm">Nenhum documento</div></div>`}
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">Arquivos</span></div>
            <div class="book-grid">
              <div class="book-item" onclick="SyntraCRM._addArquivo('foto')">${icon('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',20)}<span>Foto</span></div>
              <div class="book-item" onclick="SyntraCRM._addArquivo('doc')">${icon(ICONS.doc,20)}<span>Doc</span></div>
              <div class="book-item" onclick="SyntraCRM._addArquivo('antes')"><span style="font-size:1.2rem">↕️</span><span>Antes/Depois</span></div>
            </div>
          </div>
        </div>
        <div class="profile-main">
          <div class="card">
            <div class="card-header"><span class="card-title">Timeline · Histórico</span><button class="btn-primary btn-sm" onclick="SyntraCRM.abrirModalAddTimeline('${id}')">+ Adicionar</button></div>
            <div class="timeline" id="timeline-${id}">${SyntraCRM._renderTimeline(id,timeline)}</div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">Observações Privadas</span></div>
            <div class="form-group"><textarea id="obs-ta-${id}" rows="4" placeholder="Anotação interna...">${c.obs||''}</textarea></div>
            <button class="btn-primary btn-sm" onclick="SyntraCRM._salvarObs('${id}')">Salvar Observação</button>
          </div>
        </div>
      </div>`;
  },

  _renderInfoRows(c){
    const campos=[['Telefone',c.telefone],['WhatsApp',c.whatsapp],['Email',c.email],['CPF/Doc',c.cpf],['Cidade',c.cidade],['Origem',c.origem],['Responsável',c.responsavel],['Trat./Serviço',c.tratamento||c.tipo_imovel||c.objetivo||c.area_juridica||c.procedimento||c.servico_pref],['Próx. Retorno',c.retorno||c.proxima_sessao||c.retorno_sug],['Valor',c.orcamento||c.honorarios||c.valor_previsto]].filter(([,v])=>v);
    return campos.map(([l,v])=>`<div class="info-row"><span class="info-label">${l}</span><span class="info-value">${v}</span></div>`).join('');
  },

  _renderTimeline(cid,items){
    if(!items.length) return `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Sem registros</div></div>`;
    const colors=['var(--blue)','var(--green)','#a78bfa','var(--gold-light)','var(--orange)','var(--red)'];
    const emojis=['📋','✅','💬','📅','⚡','📝'];
    return items.slice().reverse().map((item,i)=>`<div class="timeline-item"><div class="timeline-dot" style="background:${colors[i%colors.length]};color:#fff">${emojis[i%emojis.length]}</div><div class="timeline-body"><div class="timeline-type">${item.tipo||'Registro'}</div><div class="timeline-text">${item.texto}</div><div class="timeline-time">${item.data}</div></div></div>`).join('');
  },

  _salvarObs(cid){const el=document.getElementById(`obs-ta-${cid}`);if(!el)return;const c=DB.getClientes();const i=c.findIndex(x=>x.id===cid);if(i!==-1){c[i].obs=el.value;DB.setClientes(c);}toast('Observação salva!','success');},

  exportarPerfil(id){
    const c=DB.getClientes().find(x=>x.id===id)||{}; const tl=DB.getTimeline(id);
    const txt=`SYNTRA CRM — PERFIL\n${'─'.repeat(40)}\n${Object.entries(c).map(([k,v])=>`${k}: ${v}`).join('\n')}\n\nTIMELINE\n${'─'.repeat(40)}\n${tl.map(t=>`[${t.data}] ${t.tipo}: ${t.texto}`).join('\n')||'Sem registros'}`;
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'})); a.download=`perfil_${(c.nome||'cliente').replace(/\s/g,'_')}.txt`; a.click(); toast('Perfil exportado!','success');
  },
  _addArquivo(tipo){toast(`Upload de ${tipo}: disponível com Supabase Storage`,'info');},

  /* ════════ MODAIS ════════ */
  abrirModal(titulo,html,wide=false){
    const box=document.getElementById('modal-box');
    if(wide) box.classList.add('modal-wide'); else box.classList.remove('modal-wide');
    document.getElementById('modal-content').innerHTML=`<h2 class="modal-title">${titulo}</h2>${html}`;
    document.getElementById('modal-overlay').classList.remove('hidden');
  },
  fecharModal(){document.getElementById('modal-overlay').classList.add('hidden');document.getElementById('modal-box').classList.remove('modal-wide');},

  abrirModalNovoCliente(){const conf=getNichoConf();SyntraCRM.abrirModal(`Novo ${conf.clienteLabel}`,SyntraCRM._formCliente(null));},
  abrirModalEditarCliente(id){const c=DB.getClientes().find(x=>x.id===id)||{};const conf=getNichoConf();SyntraCRM.abrirModal(`Editar ${conf.clienteLabel}`,SyntraCRM._formCliente(c));},

  _formCliente(c){
    const conf=getNichoConf();
    const statOpts=conf.statusOptions.map(s=>`<option value="${s}" ${c&&c.status===s?'selected':''}>${s}</option>`).join('');
    const cid=c?.id||'';
    return `<div class="form-grid">
      <div class="form-group"><label>Nome *</label><input type="text" id="f-nome" value="${c?.nome||''}" placeholder="Nome do ${conf.clienteLabel.toLowerCase()}"/></div>
      <div class="form-group"><label>Telefone</label><input type="text" id="f-telefone" value="${c?.telefone||''}" placeholder="(11) 99999-0000"/></div>
      <div class="form-group"><label>WhatsApp</label><input type="text" id="f-whatsapp" value="${c?.whatsapp||''}" placeholder="Número WhatsApp"/></div>
      <div class="form-group"><label>E-mail</label><input type="email" id="f-email" value="${c?.email||''}" placeholder="email@exemplo.com"/></div>
      <div class="form-group"><label>CPF / Documento</label><input type="text" id="f-cpf" value="${c?.cpf||''}" placeholder="Opcional"/></div>
      <div class="form-group"><label>Cidade</label><input type="text" id="f-cidade" value="${c?.cidade||''}" placeholder="Cidade"/></div>
      <div class="form-group"><label>Status</label><select id="f-status">${statOpts}</select></div>
      <div class="form-group"><label>Origem</label><input type="text" id="f-origem" value="${c?.origem||''}" placeholder="Instagram, Indicação..."/></div>
      <div class="form-group"><label>Responsável</label><input type="text" id="f-responsavel" value="${c?.responsavel||''}" placeholder="Profissional responsável"/></div>
      <div class="form-group"><label>Valor Previsto</label><input type="text" id="f-valor" value="${c?.valor_previsto||''}" placeholder="R$ 0,00"/></div>
      <div class="form-group span-2"><label>Observação</label><textarea id="f-obs" rows="3" placeholder="Informações importantes...">${c?.obs||''}</textarea></div>
    </div>
    <input type="hidden" id="f-id" value="${cid}"/>
    <div class="modal-actions">
      ${cid?`<button class="btn-danger btn-sm" onclick="SyntraCRM.excluirCliente('${cid}');SyntraCRM.fecharModal()">Excluir</button>`:''}
      <button class="btn-secondary btn-sm" onclick="SyntraCRM.fecharModal()">Cancelar</button>
      <button class="btn-primary btn-sm" onclick="SyntraCRM.salvarCliente()">${cid?'Salvar Alterações':'Cadastrar'}</button>
    </div>`;
  },

  salvarCliente(){
    const id=(document.getElementById('f-id')?.value||''); const nome=(document.getElementById('f-nome')?.value||'').trim();
    if(!nome){toast('Nome é obrigatório','error');return;}
    const obj={id:id||uid(),nome,telefone:document.getElementById('f-telefone')?.value||'',whatsapp:document.getElementById('f-whatsapp')?.value||'',email:document.getElementById('f-email')?.value||'',cpf:document.getElementById('f-cpf')?.value||'',cidade:document.getElementById('f-cidade')?.value||'',status:document.getElementById('f-status')?.value||'',origem:document.getElementById('f-origem')?.value||'',responsavel:document.getElementById('f-responsavel')?.value||'',valor_previsto:document.getElementById('f-valor')?.value||'',obs:document.getElementById('f-obs')?.value||''};
    const clientes=DB.getClientes(); const idx=clientes.findIndex(c=>c.id===obj.id);
    if(idx!==-1){obj.criadoEm=clientes[idx].criadoEm;clientes[idx]=obj;}else{obj.criadoEm=new Date().toLocaleDateString('pt-BR');clientes.unshift(obj);}
    DB.setClientes(clientes); SyntraCRM.fecharModal(); toast(id?'Atualizado!':'Cadastrado!','success'); SyntraCRM.navegarPara(getMenuListagem());
  },

  excluirCliente(id){
    if(!confirm('Excluir permanentemente?'))return;
    DB.setClientes(DB.getClientes().filter(c=>c.id!==id));
    DB._del(DB._key('tl_'+id)); DB._del(DB._key('docs_'+id));
    toast('Excluído','info'); SyntraCRM.navegarPara(getMenuListagem());
  },

  /* ════════ TIMELINE MODAL ════════ */
  abrirModalAddTimeline(cid){
    const conf=getNichoConf(); const types=conf.timelineTypes||['Atendimento','Nota'];
    SyntraCRM.abrirModal(`Registrar ${conf.atendLabel}`,`<div class="form-group"><label>Tipo</label><select id="tl-tipo">${types.map(t=>`<option value="${t}">${t}</option>`).join('')}</select></div><div class="form-group"><label>Descrição / Resumo</label><textarea id="tl-texto" rows="4" placeholder="Descreva o atendimento..."></textarea></div><input type="hidden" id="tl-cid" value="${cid}"/><div class="modal-actions"><button class="btn-secondary btn-sm" onclick="SyntraCRM.fecharModal()">Cancelar</button><button class="btn-primary btn-sm" onclick="SyntraCRM.salvarTimeline()">Salvar</button></div>`);
  },

  salvarTimeline(){
    const cid=document.getElementById('tl-cid')?.value; const tipo=document.getElementById('tl-tipo')?.value;
    const texto=(document.getElementById('tl-texto')?.value||'').trim();
    if(!cid||!texto){toast('Descreva o registro','error');return;}
    const tl=DB.getTimeline(cid); tl.push({id:uid(),tipo,texto,data:formatDate()}); DB.setTimeline(cid,tl);
    SyntraCRM.fecharModal(); toast('Registro salvo!','success'); SyntraCRM.abrirPerfil(cid);
  },


  /* ════════════════════════════════════════
     MÓDULO DE DOCUMENTOS — SYNTRA CRM
     Gera documentos personalizados por nicho.
     Dados puxados do perfil do cliente.
     Impressão com @media print (sidebar/topbar ocultos).
     [SUPABASE-STORAGE] Futuramente: upload do PDF gerado.
  ════════════════════════════════════════ */

  // Gera o conteúdo HTML de um documento específico
  _gerarConteudoDocumento(tipo, c) {
    const conf    = getNichoConf();
    const info    = getNichoInfo();
    const prof    = STATE.userName;
    const data    = new Date().toLocaleDateString('pt-BR');
    const hora    = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
    const nome    = c.nome || '—';
    const tel     = c.telefone || c.whatsapp || '—';
    const email   = c.email || '—';
    const cidade  = c.cidade || '—';
    const status  = c.status || '—';
    const obs     = c.obs || '—';
    const tl      = DB.getTimeline(c.id);
    const tlHTML  = tl.length
      ? tl.map(t=>`<tr><td>${t.data}</td><td><strong>${t.tipo}</strong></td><td>${t.texto}</td></tr>`).join('')
      : '<tr><td colspan="3" style="color:#999">Sem registros</td></tr>';

    // Cabeçalho comum a todos os documentos
    const header = `
      <div class="doc-header">
        <div class="doc-logo">
          <div class="doc-logo-mark">S</div>
          <div>
            <div class="doc-logo-name">SYNTRA CRM · ${info.nome}</div>
            <div class="doc-logo-sub">${conf.clienteLabel}: ${nome} · Emitido em: ${data} às ${hora}</div>
          </div>
        </div>
        <div class="doc-badge">${tipo}</div>
      </div>
      <div class="doc-divider"></div>`;

    // Rodapé comum
    const footer = `
      <div class="doc-footer">
        <div class="doc-assinatura">
          <div class="doc-assinatura-linha"></div>
          <div class="doc-assinatura-nome">${prof}</div>
          <div class="doc-assinatura-cargo">${info.nome}</div>
        </div>
        <div class="doc-rodape-info">
          <div>Data de emissão: ${data}</div>
          <div>Documento gerado pelo Syntra CRM · syntra.tec.br</div>
          <div>Este documento deve ser revisado e assinado pelo profissional responsável.</div>
        </div>
      </div>`;

    // Templates por tipo de documento
    const templates = {

      'Ficha Cadastral': `${header}
        <h2 class="doc-section-title">Ficha Cadastral</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nome Completo</td><td>${nome}</td><td class="doc-field-label">Data Nasc.</td><td>___/___/______</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td>${tel}</td><td class="doc-field-label">E-mail</td><td>${email}</td></tr>
          <tr><td class="doc-field-label">CPF / Doc.</td><td>${c.cpf||'—'}</td><td class="doc-field-label">Cidade</td><td>${cidade}</td></tr>
          <tr><td class="doc-field-label">Endereço</td><td colspan="3">___________________________________________________</td></tr>
          <tr><td class="doc-field-label">Origem</td><td>${c.origem||'—'}</td><td class="doc-field-label">Responsável</td><td>${c.responsavel||'—'}</td></tr>
          <tr><td class="doc-field-label">Status</td><td>${status}</td><td class="doc-field-label">Cadastrado em</td><td>${c.criadoEm||data}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Observações:</strong><br>${obs}</div>
        ${footer}`,

      'Ficha do Paciente': `${header}
        <h2 class="doc-section-title">Ficha do Paciente</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nome</td><td>${nome}</td><td class="doc-field-label">Data Nasc.</td><td>___/___/______</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td>${tel}</td><td class="doc-field-label">E-mail</td><td>${email}</td></tr>
          <tr><td class="doc-field-label">CPF</td><td>${c.cpf||'—'}</td><td class="doc-field-label">Cidade</td><td>${cidade}</td></tr>
          <tr><td class="doc-field-label">Convênio</td><td>___________________</td><td class="doc-field-label">Nº Carteira</td><td>___________________</td></tr>
          <tr><td class="doc-field-label">Tratamento</td><td>${c.tratamento||'—'}</td><td class="doc-field-label">Próx. Retorno</td><td>${c.retorno||c.proxima_sessao||'—'}</td></tr>
          <tr><td class="doc-field-label">Responsável Clínico</td><td>${c.responsavel||prof}</td><td class="doc-field-label">Status</td><td>${status}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Observações Clínicas:</strong><br>${obs}</div>
        <div style="background:#fff3cd;border:1px solid #ffc107;padding:10px;border-radius:6px;font-size:11px;margin-top:12px">⚠️ <strong>Aviso:</strong> Este documento é um modelo organizacional. Não substitui prontuário médico oficial. O profissional responsável deve revisar, complementar e assinar.</div>
        ${footer}`,

      'Anamnese': `${header}
        <h2 class="doc-section-title">Anamnese</h2>
        <p style="font-size:11px;color:#666;margin-bottom:12px">⚠️ Modelo editável. O profissional deve revisar e complementar antes de assinar.</p>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Paciente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Queixa Principal</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Histórico de Saúde</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Medicamentos em Uso</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Alergias</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Cirurgias Anteriores</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Histórico Familiar</td><td colspan="3">_____________________________________________</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Observações do Profissional:</strong><br>${obs||'_____________________________________________'}</div>
        ${footer}`,

      'Plano de Acompanhamento': `${header}
        <h2 class="doc-section-title">Plano de Acompanhamento</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Paciente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Profissional</td><td colspan="3">${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Objetivo</td><td colspan="3">${c.tratamento||c.objetivo||'___________________'}</td></tr>
          <tr><td class="doc-field-label">Frequência</td><td>_______/semana</td><td class="doc-field-label">Duração Prevista</td><td>_______ semanas</td></tr>
          <tr><td class="doc-field-label">Início</td><td>${c.criadoEm||'___/___/______'}</td><td class="doc-field-label">Próximo Retorno</td><td>${c.retorno||c.proxima_sessao||'___/___/______'}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Plano Detalhado:</strong><br>${c.plano_trat||c.plano||obs||'_____________________________________________'}</div>
        <div style="background:#fff3cd;border:1px solid #ffc107;padding:10px;border-radius:6px;font-size:11px;margin-top:12px">⚠️ Modelo organizacional. Não substitui prescrição médica. Deve ser revisado e assinado pelo profissional.</div>
        ${footer}`,

      'Resumo de Consulta': `${header}
        <h2 class="doc-section-title">Resumo de Consulta</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Paciente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Data</td><td>${data}</td><td class="doc-field-label">Hora</td><td>${hora}</td></tr>
          <tr><td class="doc-field-label">Profissional</td><td colspan="3">${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Procedimento</td><td colspan="3">${c.tratamento||c.procedimento||'—'}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Relato do Atendimento:</strong><br>${obs}</div>
        <div class="doc-obs-box"><strong>Evolução Observada:</strong><br>_____________________________________________</div>
        <div class="doc-obs-box"><strong>Conduta / Próximos Passos:</strong><br>_____________________________________________</div>
        <div style="background:#fff3cd;border:1px solid #ffc107;padding:10px;border-radius:6px;font-size:11px;margin-top:12px">⚠️ Modelo organizacional. Deve ser revisado e assinado pelo profissional antes de arquivar.</div>
        ${footer}`,

      'Modelo de Prescrição (Editável)': `${header}
        <h2 class="doc-section-title">Modelo de Prescrição — EDITÁVEL PELO PROFISSIONAL</h2>
        <div style="background:#fff3cd;border:2px solid #ffc107;padding:12px;border-radius:6px;margin-bottom:16px">
          <strong>⚠️ ATENÇÃO:</strong> Este é apenas um modelo em branco para organização. NÃO é uma prescrição definitiva. O profissional habilitado deve preencher, revisar, assinar e carimbar conforme legislação vigente.
        </div>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Paciente</td><td>${nome}</td><td class="doc-field-label">Data</td><td>${data}</td></tr>
          <tr><td class="doc-field-label">Profissional</td><td colspan="3">${c.responsavel||prof}</td></tr>
        </tbody></table>
        <div style="border:2px dashed #ccc;padding:20px;border-radius:6px;min-height:200px;margin-top:12px">
          <p style="color:#999;font-style:italic;font-size:12px">Espaço para o profissional preencher a prescrição manualmente ou adicionar itens</p>
          <br><br><br><br>
        </div>
        ${footer}`,

      'Encaminhamento': `${header}
        <h2 class="doc-section-title">Encaminhamento</h2>
        <div style="background:#fff3cd;border:1px solid #ffc107;padding:10px;border-radius:6px;font-size:11px;margin-bottom:12px">⚠️ Modelo organizacional. Deve ser revisado e assinado pelo profissional habilitado.</div>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Paciente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Data</td><td>${data}</td><td class="doc-field-label">Encaminhado por</td><td>${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Encaminhado para</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Especialidade</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Motivo</td><td colspan="3">_____________________________________________</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Observações:</strong><br>${obs}</div>
        ${footer}`,

      'Evolução do Paciente': `${header}
        <h2 class="doc-section-title">Evolução do Paciente</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Paciente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Período</td><td colspan="3">${c.criadoEm||'—'} até ${data}</td></tr>
          <tr><td class="doc-field-label">Profissional</td><td colspan="3">${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Tratamento</td><td colspan="3">${c.tratamento||c.procedimento||'—'}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Histórico de Atendimentos:</strong></div>
        <table class="doc-table"><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th></tr></thead><tbody>${tlHTML}</tbody></table>
        <div class="doc-obs-box"><strong>Avaliação do Profissional:</strong><br>_____________________________________________</div>
        <div style="background:#fff3cd;border:1px solid #ffc107;padding:10px;border-radius:6px;font-size:11px;margin-top:12px">⚠️ Modelo organizacional. Deve ser revisado e assinado pelo profissional responsável.</div>
        ${footer}`,

      'Relatório de Atendimento': `${header}
        <h2 class="doc-section-title">Relatório de Atendimento</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Período</td><td colspan="3">${c.criadoEm||'—'} até ${data}</td></tr>
          <tr><td class="doc-field-label">Responsável</td><td colspan="3">${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Status</td><td colspan="3">${status}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Histórico:</strong></div>
        <table class="doc-table"><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th></tr></thead><tbody>${tlHTML}</tbody></table>
        <div class="doc-obs-box"><strong>Observações:</strong><br>${obs}</div>
        ${footer}`,

      'Histórico Completo': `${header}
        <h2 class="doc-section-title">Histórico Completo</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nome</td><td>${nome}</td><td class="doc-field-label">Cadastrado em</td><td>${c.criadoEm||'—'}</td></tr>
          <tr><td class="doc-field-label">Contato</td><td>${tel}</td><td class="doc-field-label">E-mail</td><td>${email}</td></tr>
          <tr><td class="doc-field-label">Cidade</td><td>${cidade}</td><td class="doc-field-label">Status</td><td>${status}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Timeline Completa:</strong></div>
        <table class="doc-table"><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th></tr></thead><tbody>${tlHTML}</tbody></table>
        ${footer}`,

      'Termo de Autorização': `${header}
        <h2 class="doc-section-title">Termo de Autorização</h2>
        <p style="line-height:1.8;margin-bottom:16px">Eu, <strong>${nome}</strong>, portador(a) do CPF/Documento <strong>${c.cpf||'_____________'}</strong>, domiciliado(a) em <strong>${cidade}</strong>, autorizo ${info.nome} — representado(a) por <strong>${c.responsavel||prof}</strong> — a realizar os serviços/procedimentos pertinentes ao meu atendimento, conforme combinado e descrito nos registros do sistema.</p>
        <p style="line-height:1.8;margin-bottom:16px">Declaro ter sido informado(a) sobre os procedimentos, riscos e benefícios envolvidos, e consinto com a realização dos mesmos.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">${nome}<br><small>${cidade}, ${data}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">${c.responsavel||prof}<br><small>${info.nome}</small></div></div>
        </div>
        ${footer}`,

      'Termo de Consentimento': `${header}
        <h2 class="doc-section-title">Termo de Consentimento Informado</h2>
        <p style="line-height:1.8;margin-bottom:12px">Eu, <strong>${nome}</strong>, declaro que fui devidamente informado(a) sobre o procedimento de <strong>${c.procedimento||c.tratamento||'___________________'}</strong> a ser realizado por <strong>${c.responsavel||prof}</strong>.</p>
        <p style="line-height:1.8;margin-bottom:12px">Estou ciente dos benefícios esperados, possíveis riscos e alternativas disponíveis. Autorizo a realização do procedimento e o registro fotográfico para fins de acompanhamento clínico.</p>
        <p style="line-height:1.8;margin-bottom:24px">Observações adicionais: ${obs}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:30px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Assinatura do Cliente<br><small>${nome}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Assinatura do Profissional<br><small>${c.responsavel||prof}</small></div></div>
        </div>
        ${footer}`,

      'Proposta Comercial': `${header}
        <h2 class="doc-section-title">Proposta Comercial</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Data</td><td>${data}</td><td class="doc-field-label">Validade</td><td>30 dias</td></tr>
          <tr><td class="doc-field-label">Serviço</td><td colspan="3">${c.tratamento||c.procedimento||c.tipo_imovel||'___________________'}</td></tr>
          <tr><td class="doc-field-label">Valor</td><td colspan="3">${c.valor_previsto||c.orcamento||'R$ ___________________'}</td></tr>
          <tr><td class="doc-field-label">Forma de Pagamento</td><td colspan="3">_____________________________________________</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Descrição dos Serviços:</strong><br>${obs||'_____________________________________________'}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:30px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Aceite do Cliente<br><small>${nome} — ${data}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">${c.responsavel||prof}<br><small>${info.nome}</small></div></div>
        </div>
        ${footer}`,

      'Recibo': `${header}
        <h2 class="doc-section-title">Recibo de Pagamento</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Recebemos de</td><td colspan="3"><strong>${nome}</strong></td></tr>
          <tr><td class="doc-field-label">Valor</td><td colspan="3"><strong>${c.valor_previsto||c.orcamento||'R$ ___________________'}</strong></td></tr>
          <tr><td class="doc-field-label">Referente a</td><td colspan="3">${c.tratamento||c.procedimento||c.servico_pref||'Serviços prestados'}</td></tr>
          <tr><td class="doc-field-label">Forma de Pagamento</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Data</td><td colspan="3">${data}</td></tr>
        </tbody></table>
        <div style="margin-top:40px;text-align:center">
          <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:250px">${c.responsavel||prof}<br><small>${info.nome} — ${data}</small></div>
        </div>
        ${footer}`,

      'Contrato Simples': `${header}
        <h2 class="doc-section-title">Contrato de Prestação de Serviços</h2>
        <p style="line-height:1.8;margin-bottom:12px">As partes abaixo qualificadas celebram o presente Contrato de Prestação de Serviços:</p>
        <p><strong>CONTRATANTE:</strong> ${nome}, CPF/CNPJ: ${c.cpf||'_____________'}, endereço: ${cidade}.</p>
        <p style="margin-top:8px"><strong>CONTRATADO(A):</strong> ${c.responsavel||prof}, ${info.nome}.</p>
        <p style="margin-top:16px;line-height:1.8"><strong>OBJETO:</strong> ${c.tratamento||c.procedimento||c.tipo_imovel||'Serviços conforme combinado entre as partes.'}</p>
        <p style="margin-top:12px;line-height:1.8"><strong>VALOR:</strong> ${c.valor_previsto||c.orcamento||'R$ ___________________'}</p>
        <p style="margin-top:12px;line-height:1.8"><strong>VIGÊNCIA:</strong> A partir de ${data}.</p>
        <p style="margin-top:12px;font-size:11px;color:#666">Este é um modelo simplificado. Recomenda-se revisão por advogado para contratos de maior complexidade.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Contratante: ${nome}<br><small>${data}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Contratado(a): ${c.responsavel||prof}<br><small>${data}</small></div></div>
        </div>
        ${footer}`,

      'Comprovante de Agendamento': `${header}
        <h2 class="doc-section-title">Comprovante de Agendamento</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3"><strong>${nome}</strong></td></tr>
          <tr><td class="doc-field-label">Serviço</td><td colspan="3">${c.tratamento||c.procedimento||c.servico_pref||'___________________'}</td></tr>
          <tr><td class="doc-field-label">Data do Agendamento</td><td>${c.retorno||c.proxima_sessao||'___/___/______'}</td><td class="doc-field-label">Horário</td><td>____:____</td></tr>
          <tr><td class="doc-field-label">Profissional</td><td colspan="3">${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Local</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Observação</td><td colspan="3">${obs||'—'}</td></tr>
        </tbody></table>
        <p style="margin-top:16px;font-size:12px;color:#666">Em caso de necessidade de cancelamento, favor avisar com no mínimo 24h de antecedência.</p>
        ${footer}`,

      // ── ACADEMIA / PERSONAL ──
      'Ficha de Aluno': `${header}
        <h2 class="doc-section-title">Ficha de Aluno</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nome</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td>${tel}</td><td class="doc-field-label">E-mail</td><td>${email}</td></tr>
          <tr><td class="doc-field-label">Objetivo</td><td>${c.objetivo||'—'}</td><td class="doc-field-label">Plano</td><td>${c.plano||'—'}</td></tr>
          <tr><td class="doc-field-label">Peso</td><td>${c.peso||'___ kg'}</td><td class="doc-field-label">Altura</td><td>${c.altura||'___ m'}</td></tr>
          <tr><td class="doc-field-label">Meta</td><td colspan="3">${c.meta||'_____________________________________________'}</td></tr>
          <tr><td class="doc-field-label">Instrutor</td><td>${c.responsavel||prof}</td><td class="doc-field-label">Início</td><td>${c.criadoEm||'___/___/______'}</td></tr>
        </tbody></table>
        ${footer}`,

      'Avaliação Física': `${header}
        <h2 class="doc-section-title">Avaliação Física</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Aluno</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Data</td><td>${data}</td><td class="doc-field-label">Avaliador</td><td>${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Peso</td><td>${c.peso||'___ kg'}</td><td class="doc-field-label">Altura</td><td>${c.altura||'___ m'}</td></tr>
          <tr><td class="doc-field-label">IMC</td><td>_______</td><td class="doc-field-label">% Gordura</td><td>_______ %</td></tr>
          <tr><td class="doc-field-label">Peito</td><td>_______ cm</td><td class="doc-field-label">Cintura</td><td>_______ cm</td></tr>
          <tr><td class="doc-field-label">Quadril</td><td>_______ cm</td><td class="doc-field-label">Braço</td><td>_______ cm</td></tr>
          <tr><td class="doc-field-label">Objetivo</td><td colspan="3">${c.objetivo||c.meta||'—'}</td></tr>
        </tbody></table>
        ${footer}`,

      'Ficha de Treino': `${header}
        <h2 class="doc-section-title">Ficha de Treino</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Aluno</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Instrutor</td><td>${c.responsavel||prof}</td><td class="doc-field-label">Data</td><td>${data}</td></tr>
          <tr><td class="doc-field-label">Plano</td><td colspan="3">${c.plano||'_____________________________________________'}</td></tr>
        </tbody></table>
        <table class="doc-table" style="margin-top:12px"><thead><tr><th>Exercício</th><th>Séries</th><th>Repetições</th><th>Carga</th><th>Descanso</th></tr></thead><tbody>
          ${[1,2,3,4,5,6,7,8].map(()=>'<tr><td>_________________________</td><td>___</td><td>___</td><td>___ kg</td><td>___ seg</td></tr>').join('')}
        </tbody></table>
        ${footer}`,

      'Plano Semanal': `${header}
        <h2 class="doc-section-title">Plano Semanal de Treinos</h2>
        <table class="doc-table" style="margin-top:12px"><thead><tr><th>Dia</th><th>Treino</th><th>Horário</th><th>Observação</th></tr></thead><tbody>
          ${['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'].map(d=>`<tr><td>${d}</td><td>_________________________</td><td>____:____</td><td>_________________________</td></tr>`).join('')}
        </tbody></table>
        ${footer}`,

      'Evolução Corporal': `${header}
        <h2 class="doc-section-title">Evolução Corporal</h2>
        <table class="doc-table"><thead><tr><th>Data</th><th>Peso</th><th>% Gordura</th><th>Cintura</th><th>Observação</th></tr></thead><tbody>
          ${tl.length ? tl.map(t=>`<tr><td>${t.data}</td><td>___</td><td>___</td><td>___</td><td>${t.texto.substr(0,40)}</td></tr>`).join('') : [1,2,3,4,5].map(()=>'<tr><td>___/___/______</td><td>___ kg</td><td>___ %</td><td>___ cm</td><td>_________________________</td></tr>').join('')}
        </tbody></table>
        ${footer}`,

      'Termo de Responsabilidade': `${header}
        <h2 class="doc-section-title">Termo de Responsabilidade</h2>
        <p style="line-height:1.8;margin-bottom:12px">Eu, <strong>${nome}</strong>, declaro estar ciente de que a prática de atividade física envolve riscos, e que fui devidamente orientado(a) pelo profissional <strong>${c.responsavel||prof}</strong>.</p>
        <p style="line-height:1.8;margin-bottom:12px">Declaro ainda que as informações prestadas na ficha de avaliação são verídicas, e me responsabilizo por informar quaisquer alterações no meu estado de saúde.</p>
        <p style="line-height:1.8">Isento o profissional e o estabelecimento de responsabilidades decorrentes de lesões causadas por uso inadequado dos equipamentos ou inobservância das orientações fornecidas.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">${nome}<br><small>${data}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">${c.responsavel||prof}<br><small>${info.nome}</small></div></div>
        </div>
        ${footer}`,

      // ── ADVOCACIA ──
      'Ficha do Cliente': `${header}
        <h2 class="doc-section-title">Ficha do Cliente</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nome</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">CPF</td><td>${c.cpf||'—'}</td><td class="doc-field-label">Cidade</td><td>${cidade}</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td>${tel}</td><td class="doc-field-label">E-mail</td><td>${email}</td></tr>
          <tr><td class="doc-field-label">Área Jurídica</td><td colspan="3">${c.area_juridica||'—'}</td></tr>
          <tr><td class="doc-field-label">Resumo do Caso</td><td colspan="3">${c.resumo_caso||obs||'—'}</td></tr>
          <tr><td class="doc-field-label">Advogado Resp.</td><td colspan="3">${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Status</td><td>${status}</td><td class="doc-field-label">Prazo</td><td>${c.prazo||'—'}</td></tr>
        </tbody></table>
        ${footer}`,

      'Resumo do Caso': `${header}
        <h2 class="doc-section-title">Resumo do Caso</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Área</td><td>${c.area_juridica||'—'}</td><td class="doc-field-label">Advogado</td><td>${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Prazo</td><td>${c.prazo||'—'}</td><td class="doc-field-label">Status</td><td>${status}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Resumo:</strong><br>${c.resumo_caso||obs||'_____________________________________________'}</div>
        <div class="doc-obs-box"><strong>Documentos Necessários:</strong><br>${c.docs_necessarios||'_____________________________________________'}</div>
        <div class="doc-obs-box"><strong>Andamento:</strong></div>
        <table class="doc-table"><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th></tr></thead><tbody>${tlHTML}</tbody></table>
        ${footer}`,

      'Checklist de Documentos': `${header}
        <h2 class="doc-section-title">Checklist de Documentos</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td>${nome}</td><td class="doc-field-label">Caso</td><td>${c.area_juridica||'—'}</td></tr>
        </tbody></table>
        <table class="doc-table" style="margin-top:12px"><thead><tr><th style="width:40px">✓</th><th>Documento</th><th>Status</th><th>Observação</th></tr></thead><tbody>
          ${(c.docs_necessarios||'Documento 1,Documento 2,Documento 3').split(',').map(d=>`<tr><td style="text-align:center">☐</td><td>${d.trim()}</td><td>Pendente</td><td>___________________</td></tr>`).join('')}
        </tbody></table>
        ${footer}`,

      'Contrato de Honorários': `${header}
        <h2 class="doc-section-title">Contrato de Honorários Advocatícios — MODELO</h2>
        <div style="background:#fff3cd;border:1px solid #ffc107;padding:10px;border-radius:6px;font-size:11px;margin-bottom:12px">⚠️ Modelo simplificado para organização interna. Consulte a OAB e adapte conforme legislação vigente.</div>
        <p style="line-height:1.8;margin-bottom:12px">As partes qualificam-se: <strong>CONTRATANTE:</strong> ${nome}; <strong>CONTRATADO(A):</strong> ${c.responsavel||prof}, ${info.nome}.</p>
        <p style="line-height:1.8;margin-bottom:8px"><strong>OBJETO:</strong> ${c.area_juridica||'Prestação de serviços advocatícios'} — ${c.resumo_caso||obs||'conforme combinado'}.</p>
        <p style="line-height:1.8;margin-bottom:8px"><strong>HONORÁRIOS:</strong> ${c.honorarios||'R$ ___________________'}</p>
        <p style="line-height:1.8;margin-bottom:8px"><strong>FORMA DE PAGAMENTO:</strong> _____________________________________________</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:30px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">${nome}<br><small>${data}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">${c.responsavel||prof}<br><small>OAB: _____________</small></div></div>
        </div>
        ${footer}`,

      'Relatório de Andamento': `${header}
        <h2 class="doc-section-title">Relatório de Andamento</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Área</td><td>${c.area_juridica||'—'}</td><td class="doc-field-label">Status</td><td>${status}</td></tr>
          <tr><td class="doc-field-label">Prazo</td><td>${c.prazo||'—'}</td><td class="doc-field-label">Advogado</td><td>${c.responsavel||prof}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Andamento Processual:</strong></div>
        <table class="doc-table"><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th></tr></thead><tbody>${tlHTML}</tbody></table>
        ${footer}`,

      'Procuração Modelo': `${header}
        <h2 class="doc-section-title">Procuração — MODELO</h2>
        <div style="background:#fff3cd;border:1px solid #ffc107;padding:10px;border-radius:6px;font-size:11px;margin-bottom:12px">⚠️ Modelo simplificado. Deve ser adaptado por advogado habilitado conforme o caso e jurisdição.</div>
        <p style="line-height:2;text-align:justify">Eu, <strong>${nome}</strong>, portador(a) do CPF nº <strong>${c.cpf||'___.___.___-__'}</strong>, residente em <strong>${cidade}</strong>, nomeio como meu(minha) bastante procurador(a) o(a) Sr(a). <strong>${c.responsavel||prof}</strong>, inscrito(a) na OAB/__ sob nº ________, ao qual confiro poderes para o foro em geral, podendo representar-me em todos os atos do processo judicial referente a <strong>${c.area_juridica||'___________________'}</strong>.</p>
        <p style="margin-top:16px">${cidade}, ${data}.</p>
        <div style="margin-top:40px;text-align:center"><div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:300px">${nome}<br><small>CPF: ${c.cpf||'___.___.___-__'}</small></div></div>
        ${footer}`,

      // ── ESTÉTICA ──
      'Ficha da Cliente': `${header}
        <h2 class="doc-section-title">Ficha da Cliente</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nome</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td>${tel}</td><td class="doc-field-label">E-mail</td><td>${email}</td></tr>
          <tr><td class="doc-field-label">Cidade</td><td>${cidade}</td><td class="doc-field-label">Data Nasc.</td><td>___/___/______</td></tr>
          <tr><td class="doc-field-label">Procedimento</td><td colspan="3">${c.procedimento||'—'}</td></tr>
          <tr><td class="doc-field-label">Sessões Prev.</td><td>${c.sessoes_prev||'—'}</td><td class="doc-field-label">Próx. Retorno</td><td>${c.retorno||'—'}</td></tr>
          <tr><td class="doc-field-label">Profissional</td><td colspan="3">${c.responsavel||prof}</td></tr>
        </tbody></table>
        ${footer}`,

      'Anamnese Estética': `${header}
        <h2 class="doc-section-title">Anamnese Estética</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Tipo de Pele</td><td>Normal ☐ Seca ☐ Oleosa ☐ Mista ☐</td><td class="doc-field-label">Sensibilidade</td><td>Alta ☐ Média ☐ Baixa ☐</td></tr>
          <tr><td class="doc-field-label">Alergias</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Medicamentos</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Gestante</td><td>Sim ☐ Não ☐</td><td class="doc-field-label">Amamentando</td><td>Sim ☐ Não ☐</td></tr>
          <tr><td class="doc-field-label">Procedimento Desejado</td><td colspan="3">${c.procedimento||'—'}</td></tr>
          <tr><td class="doc-field-label">Expectativa</td><td colspan="3">_____________________________________________</td></tr>
        </tbody></table>
        ${footer}`,

      'Plano de Sessões': `${header}
        <h2 class="doc-section-title">Plano de Sessões</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Procedimento</td><td colspan="3">${c.procedimento||'—'}</td></tr>
          <tr><td class="doc-field-label">Total Sessões</td><td>${c.sessoes_prev||'—'}</td><td class="doc-field-label">Valor Total</td><td>${c.orcamento||'—'}</td></tr>
        </tbody></table>
        <table class="doc-table" style="margin-top:12px"><thead><tr><th>Sessão</th><th>Data</th><th>Procedimento</th><th>Observação</th></tr></thead><tbody>
          ${[1,2,3,4,5,6,7,8].map(i=>`<tr><td style="text-align:center">${i}ª</td><td>___/___/______</td><td>_________________________</td><td>_________________________</td></tr>`).join('')}
        </tbody></table>
        ${footer}`,

      'Registro Antes e Depois': `${header}
        <h2 class="doc-section-title">Registro Antes e Depois</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Procedimento</td><td colspan="3">${c.procedimento||'—'}</td></tr>
          <tr><td class="doc-field-label">Profissional</td><td colspan="3">${c.responsavel||prof}</td></tr>
        </tbody></table>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:16px">
          <div style="border:1px solid #ddd;border-radius:8px;padding:12px;text-align:center;min-height:200px"><strong>ANTES</strong><br><small>${c.criadoEm||'Data:'} ___/___/______</small><div style="margin-top:12px;color:#999;font-size:12px">[ Espaço para foto ]</div></div>
          <div style="border:1px solid #ddd;border-radius:8px;padding:12px;text-align:center;min-height:200px"><strong>DEPOIS</strong><br><small>Data: ${data}</small><div style="margin-top:12px;color:#999;font-size:12px">[ Espaço para foto ]</div></div>
        </div>
        <div class="doc-obs-box"><strong>Evolução observada:</strong><br>${obs||'_____________________________________________'}</div>
        ${footer}`,

      'Orientações Pós-Procedimento': `${header}
        <h2 class="doc-section-title">Orientações Pós-Procedimento</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td>${nome}</td><td class="doc-field-label">Data</td><td>${data}</td></tr>
          <tr><td class="doc-field-label">Procedimento</td><td colspan="3">${c.procedimento||'—'}</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Cuidados Recomendados:</strong><br>${obs||'• Evitar exposição solar por 24h\n• Não usar produtos com álcool\n• Manter hidratação\n• Em caso de reação, contate o profissional'}</div>
        <div class="doc-obs-box"><strong>Retorno em:</strong><br>${c.retorno||'___/___/______'}</div>
        <div style="text-align:center;margin-top:30px"><div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:250px">${c.responsavel||prof}<br><small>${info.nome}</small></div></div>
        ${footer}`,

      // ── BARBEARIA ──
      'Histórico de Cortes': `${header}
        <h2 class="doc-section-title">Histórico de Cortes</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Barbeiro Resp.</td><td>${c.barbeiro_resp||c.responsavel||prof}</td><td class="doc-field-label">Último Corte</td><td>${c.ultimo_corte||'—'}</td></tr>
          <tr><td class="doc-field-label">Serv. Preferido</td><td colspan="3">${c.servico_pref||'—'}</td></tr>
        </tbody></table>
        <table class="doc-table" style="margin-top:12px"><thead><tr><th>Data</th><th>Serviço</th><th>Barbeiro</th><th>Valor</th><th>Obs.</th></tr></thead><tbody>
          ${tl.length ? tl.map(t=>`<tr><td>${t.data}</td><td>${t.tipo}</td><td>${c.barbeiro_resp||'—'}</td><td>—</td><td>${t.texto.substr(0,30)}</td></tr>`).join('') : [1,2,3,4,5].map(()=>'<tr><td>___/___/______</td><td>_________________</td><td>_________</td><td>R$____</td><td>___________</td></tr>').join('')}
        </tbody></table>
        ${footer}`,

      'Preferências do Cliente': `${header}
        <h2 class="doc-section-title">Preferências do Cliente</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nome</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Serv. Preferido</td><td colspan="3">${c.servico_pref||'—'}</td></tr>
          <tr><td class="doc-field-label">Barbeiro Pref.</td><td colspan="3">${c.barbeiro_resp||c.responsavel||'—'}</td></tr>
          <tr><td class="doc-field-label">Retorno Sugerido</td><td colspan="3">${c.retorno_sug||'—'}</td></tr>
          <tr><td class="doc-field-label">Observações</td><td colspan="3">${obs||'—'}</td></tr>
        </tbody></table>
        ${footer}`,

      // ── IMOBILIÁRIA / CORRETOR ──
      'Ficha do Comprador': `${header}
        <h2 class="doc-section-title">Ficha do Comprador</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nome</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">CPF</td><td>${c.cpf||'—'}</td><td class="doc-field-label">Cidade</td><td>${cidade}</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td>${tel}</td><td class="doc-field-label">E-mail</td><td>${email}</td></tr>
          <tr><td class="doc-field-label">Tipo Imóvel</td><td>${c.tipo_imovel||'—'}</td><td class="doc-field-label">Faixa de Valor</td><td>${c.faixa_valor||'—'}</td></tr>
          <tr><td class="doc-field-label">Financiamento</td><td>${c.financiamento||'—'}</td><td class="doc-field-label">Entrada</td><td>${c.entrada||'—'}</td></tr>
          <tr><td class="doc-field-label">Corretor</td><td colspan="3">${c.responsavel||prof}</td></tr>
        </tbody></table>
        ${footer}`,

      'Ficha do Vendedor': `${header}
        <h2 class="doc-section-title">Ficha do Vendedor / Proprietário</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nome</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">CPF/CNPJ</td><td>${c.cpf||'—'}</td><td class="doc-field-label">Cidade</td><td>${cidade}</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td>${tel}</td><td class="doc-field-label">E-mail</td><td>${email}</td></tr>
          <tr><td class="doc-field-label">Imóvel</td><td colspan="3">${c.imovel_interesse||c.tipo_imovel||'_____________________________________________'}</td></tr>
          <tr><td class="doc-field-label">Valor Pretendido</td><td colspan="3">${c.faixa_valor||c.valor_previsto||'—'}</td></tr>
          <tr><td class="doc-field-label">Corretor</td><td colspan="3">${c.responsavel||prof}</td></tr>
        </tbody></table>
        ${footer}`,

      'Relatório de Visita': `${header}
        <h2 class="doc-section-title">Relatório de Visita</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Imóvel Visitado</td><td colspan="3">${c.imovel_interesse||c.tipo_imovel||'—'}</td></tr>
          <tr><td class="doc-field-label">Data da Visita</td><td>${data}</td><td class="doc-field-label">Corretor</td><td>${c.responsavel||prof}</td></tr>
          <tr><td class="doc-field-label">Interesse do Cliente</td><td colspan="3">Alto ☐ Médio ☐ Baixo ☐</td></tr>
        </tbody></table>
        <div class="doc-obs-box"><strong>Observações da Visita:</strong><br>${obs||'_____________________________________________'}</div>
        <div class="doc-obs-box"><strong>Próximos Passos:</strong><br>_____________________________________________</div>
        ${footer}`,

      'Proposta de Compra': `${header}
        <h2 class="doc-section-title">Proposta de Compra</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Comprador</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Imóvel</td><td colspan="3">${c.imovel_interesse||c.tipo_imovel||'_____________________________________________'}</td></tr>
          <tr><td class="doc-field-label">Valor Ofertado</td><td colspan="3">${c.faixa_valor||c.valor_previsto||'R$ ___________________'}</td></tr>
          <tr><td class="doc-field-label">Forma de Pagamento</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Financiamento</td><td>${c.financiamento||'—'}</td><td class="doc-field-label">Entrada</td><td>${c.entrada||'R$ ___________________'}</td></tr>
          <tr><td class="doc-field-label">Validade da Proposta</td><td colspan="3">_____________________________________________</td></tr>
        </tbody></table>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:30px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">${nome}<br><small>${data}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">${c.responsavel||prof}<br><small>Corretor CRECI: _______</small></div></div>
        </div>
        ${footer}`,

      'Simulação de Financiamento': `${header}
        <h2 class="doc-section-title">Simulação de Financiamento</h2>
        <div style="background:#fff3cd;border:1px solid #ffc107;padding:10px;border-radius:6px;font-size:11px;margin-bottom:12px">⚠️ Simulação ilustrativa. Valores definitivos devem ser confirmados com instituição financeira.</div>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Valor do Imóvel</td><td colspan="3">${c.faixa_valor||'R$ ___________________'}</td></tr>
          <tr><td class="doc-field-label">Entrada</td><td>${c.entrada||'R$ ___________________'}</td><td class="doc-field-label">% Entrada</td><td>_______ %</td></tr>
          <tr><td class="doc-field-label">Valor Financiado</td><td colspan="3">R$ ___________________</td></tr>
          <tr><td class="doc-field-label">Prazo</td><td>_______ meses</td><td class="doc-field-label">Taxa Mensal</td><td>_______ %</td></tr>
          <tr><td class="doc-field-label">Parcela Estimada</td><td colspan="3">R$ ___________________</td></tr>
        </tbody></table>
        ${footer}`,

      // ── ESCOLA ──
      'Certificado de Conclusão': `${header}
        <div style="text-align:center;padding:20px 0">
          <div style="font-size:28px;font-weight:800;font-family:serif;margin-bottom:8px">CERTIFICADO DE CONCLUSÃO</div>
          <div style="font-size:14px;color:#666;margin-bottom:24px">${info.nome}</div>
          <div style="font-size:16px;margin-bottom:8px">Certificamos que</div>
          <div style="font-size:28px;font-weight:700;border-bottom:2px solid #333;display:inline-block;padding-bottom:4px;min-width:400px;margin-bottom:12px">${nome}</div>
          <div style="font-size:14px;line-height:1.8">concluiu com êxito o curso/programa de<br><strong style="font-size:16px">${c.tratamento||c.objetivo||'___________________'}</strong><br>com carga horária de _______ horas.</div>
          <div style="margin:24px 0;font-size:13px">${cidade}, ${data}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;margin-top:20px">
            <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Diretor(a)<br><small>___________________</small></div></div>
            <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Coordenador(a)<br><small>${prof}</small></div></div>
          </div>
        </div>
        ${footer}`,

      // ── SERVIÇOS GERAIS (ótica, auto peças, farmácia, etc) ──
      'Ordem de Serviço': `${header}
        <h2 class="doc-section-title">Ordem de Serviço</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nº OS</td><td>${uid().substr(0,6).toUpperCase()}</td><td class="doc-field-label">Data</td><td>${data}</td></tr>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td>${tel}</td><td class="doc-field-label">Cidade</td><td>${cidade}</td></tr>
          <tr><td class="doc-field-label">Problema Relatado</td><td colspan="3">${obs||'_____________________________________________'}</td></tr>
          <tr><td class="doc-field-label">Serviço a Realizar</td><td colspan="3">_____________________________________________</td></tr>
          <tr><td class="doc-field-label">Valor</td><td>${c.valor_previsto||c.orcamento||'R$ ___________________'}</td><td class="doc-field-label">Prazo Entrega</td><td>___/___/______</td></tr>
        </tbody></table>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:24px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Assinatura do Cliente<br><small>${nome}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Responsável Técnico<br><small>${c.responsavel||prof}</small></div></div>
        </div>
        ${footer}`,

      'Orçamento': `${header}
        <h2 class="doc-section-title">Orçamento</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nº</td><td>${uid().substr(0,6).toUpperCase()}</td><td class="doc-field-label">Data</td><td>${data}</td></tr>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td colspan="3">${tel}</td></tr>
        </tbody></table>
        <table class="doc-table" style="margin-top:12px"><thead><tr><th>Descrição</th><th>Qtd</th><th>Valor Unit.</th><th>Total</th></tr></thead><tbody>
          ${[1,2,3,4].map(()=>'<tr><td>_________________________________</td><td>____</td><td>R$ ________</td><td>R$ ________</td></tr>').join('')}
          <tr><td colspan="3" style="text-align:right"><strong>TOTAL</strong></td><td><strong>${c.valor_previsto||c.orcamento||'R$ ___________________'}</strong></td></tr>
        </tbody></table>
        <p style="margin-top:12px;font-size:12px">Validade: 15 dias · ${info.nome}</p>
        ${footer}`,

      'Pedido': `${header}
        <h2 class="doc-section-title">Pedido</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Nº Pedido</td><td>${uid().substr(0,6).toUpperCase()}</td><td class="doc-field-label">Data</td><td>${data}</td></tr>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Telefone</td><td colspan="3">${tel}</td></tr>
          <tr><td class="doc-field-label">Observações</td><td colspan="3">${obs||'—'}</td></tr>
        </tbody></table>
        <table class="doc-table" style="margin-top:12px"><thead><tr><th>Item</th><th>Qtd</th><th>Valor</th></tr></thead><tbody>
          ${[1,2,3,4].map(()=>'<tr><td>_________________________________</td><td>____</td><td>R$ ________</td></tr>').join('')}
        </tbody></table>
        ${footer}`,

      'Comprovante de Entrega': `${header}
        <h2 class="doc-section-title">Comprovante de Entrega</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Produto/Serviço</td><td colspan="3">${c.tratamento||c.procedimento||c.servico_pref||'—'}</td></tr>
          <tr><td class="doc-field-label">Data Entrega</td><td>${data}</td><td class="doc-field-label">Valor</td><td>${c.valor_previsto||c.orcamento||'—'}</td></tr>
        </tbody></table>
        <p style="margin-top:16px;text-align:center">Declaro ter recebido o(s) item(ns) acima em perfeitas condições.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:30px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Assinatura do Recebedor<br><small>${nome}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">Responsável pela Entrega<br><small>${c.responsavel||prof}</small></div></div>
        </div>
        ${footer}`,

      'Lista de Imóveis de Interesse': `${header}
        <h2 class="doc-section-title">Lista de Imóveis de Interesse</h2>
        <table class="doc-table"><tbody>
          <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
          <tr><td class="doc-field-label">Tipo Desejado</td><td>${c.tipo_imovel||'—'}</td><td class="doc-field-label">Faixa de Valor</td><td>${c.faixa_valor||'—'}</td></tr>
          <tr><td class="doc-field-label">Financiamento</td><td>${c.financiamento||'—'}</td><td class="doc-field-label">Corretor</td><td>${c.responsavel||prof}</td></tr>
        </tbody></table>
        <table class="doc-table" style="margin-top:12px"><thead><tr><th>Endereço</th><th>Tipo</th><th>Valor</th><th>Status</th></tr></thead><tbody>
          ${[1,2,3,4,5].map(()=>'<tr><td>___________________</td><td>___________</td><td>R$ ________</td><td>Visitar ☐</td></tr>').join('')}
        </tbody></table>
        ${footer}`,

      'Declaração de Matrícula': `${header}
        <h2 class="doc-section-title">Declaração de Matrícula</h2>
        <p style="line-height:2;text-align:justify;margin-bottom:16px">Declaramos para os devidos fins que <strong>${nome}</strong>, portador(a) do CPF/Documento nº <strong>${c.cpf||'___.___.___-__'}</strong>, encontra-se devidamente matriculado(a) no curso/programa de <strong>${c.tratamento||c.objetivo||'___________________'}</strong>, na instituição <strong>${info.nome}</strong>, com início em <strong>${c.criadoEm||'___/___/______'}</strong>.</p>
        <p style="text-align:center;margin-top:24px">${cidade}, ${data}</p>
        <div style="margin-top:30px;text-align:center"><div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:250px">${prof}<br><small>Responsável · ${info.nome}</small></div></div>
        ${footer}`,
    };

    // Fallback genérico para tipos não mapeados
    return templates[tipo] || `${header}
      <h2 class="doc-section-title">${tipo}</h2>
      <table class="doc-table"><tbody>
        <tr><td class="doc-field-label">Cliente</td><td colspan="3">${nome}</td></tr>
        <tr><td class="doc-field-label">Data</td><td>${data}</td><td class="doc-field-label">Responsável</td><td>${c.responsavel||prof}</td></tr>
        <tr><td class="doc-field-label">Cidade</td><td>${cidade}</td><td class="doc-field-label">Status</td><td>${status}</td></tr>
      </tbody></table>
      <div class="doc-obs-box"><strong>Conteúdo:</strong><br>${obs||'_____________________________________________'}</div>
      ${footer}`;
  },


  // ── Tela de documentos a partir do perfil ──
  abrirDocumentosPerfil(clienteId) {
    const clientes = DB.getClientes();
    const c = clientes.find(x => x.id === clienteId);
    if (!c) { toast('Registro não encontrado', 'error'); return; }
    STATE.clienteAbertoId = clienteId;
    const conf = getNichoConf();
    const docs = DB.getDocumentos(clienteId);
    const tiposDisponiveis = conf.documentos || NICHO_CONFIG.default.documentos;

    document.getElementById('content-area').innerHTML = `
      <div class="page-header">
        <div class="flex items-center gap-2">
          <button class="btn-ghost btn-sm" onclick="SyntraCRM.abrirPerfil('${clienteId}')">← Perfil</button>
          <div>
            <h1 class="page-title">${icon(ICONS.doc,20)} Documentos · ${c.nome}</h1>
            <p class="page-desc">${conf.clienteLabel} · ${tiposDisponiveis.length} modelos disponíveis</p>
          </div>
        </div>
        <div class="page-actions">
          <button class="btn-ghost btn-sm" onclick="SyntraCRM.navegarPara('${getMenuListagem()}')">← Lista</button>
        </div>
      </div>

      <div class="col-2">
        <!-- Coluna esquerda: gerar novo -->
        <div>
          <div class="card mb-2">
            <div class="card-header"><span class="card-title">Gerar Novo Documento</span></div>
            <p class="fs-sm text-muted mb-2">Selecione o modelo e clique em Gerar. O documento puxará os dados do perfil automaticamente.</p>
            <div class="form-group">
              <label>Tipo de Documento</label>
              <select id="doc-tipo-select">
                ${tiposDisponiveis.map(d => `<option value="${d}">${d}</option>`).join('')}
              </select>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn-primary btn-sm" onclick="SyntraCRM.gerarDocumento('${clienteId}')">
                ${icon(ICONS.doc,14)} Gerar Documento
              </button>
              <button class="btn-secondary btn-sm" onclick="SyntraCRM.gerarEImprimirDocumento('${clienteId}')">
                🖨 Gerar e Imprimir
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><span class="card-title">Dados do Perfil</span></div>
            <div class="info-list" style="padding:0">${SyntraCRM._renderInfoRows(c)}</div>
          </div>
        </div>

        <!-- Coluna direita: documentos salvos -->
        <div>
          <div class="card" style="padding:0">
            <div class="card-header" style="padding:.75rem 1rem">
              <span class="card-title">Documentos Salvos (${docs.length})</span>
            </div>
            <div id="docs-lista">
              ${docs.length ? docs.slice().reverse().map(d => `
                <div class="activity-item" style="padding:.75rem 1rem;border-bottom:1px solid var(--border)">
                  <div class="activity-dot blue"></div>
                  <div class="activity-main">
                    <div class="activity-text fw-600 fs-sm">${d.tipo}</div>
                    <div class="activity-time">Gerado em ${d.data}</div>
                  </div>
                  <div style="display:flex;gap:4px">
                    <button class="btn-icon btn-sm" title="Visualizar e Imprimir" onclick="SyntraCRM.visualizarDocumento('${clienteId}','${d.id}')">👁</button>
                    <button class="btn-icon btn-sm" title="Imprimir" onclick="SyntraCRM.imprimirDocumentoSalvo('${clienteId}','${d.id}')">🖨</button>
                    <button class="btn-icon btn-sm" title="Copiar" onclick="SyntraCRM.copiarDocumento('${clienteId}','${d.id}')">📋</button>
                    <button class="btn-icon btn-sm" title="Excluir" onclick="SyntraCRM.excluirDocumento('${clienteId}','${d.id}')" style="color:var(--red)">
                      ${icon('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>',13)}
                    </button>
                  </div>
                </div>`).join('')
              : `<div class="empty-state"><div class="empty-icon">📄</div><div class="empty-title">Nenhum documento salvo</div><div class="empty-desc">Gere um documento pelo painel ao lado.</div></div>`}
            </div>
          </div>
        </div>
      </div>

      <!-- Área de preview do documento -->
      <div id="doc-preview-area" style="display:none" class="mt-2">
        <div class="card">
          <div class="card-header">
            <span class="card-title">📄 Preview do Documento</span>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <button class="btn-primary btn-sm" onclick="SyntraCRM._imprimirPreview()">🖨 Imprimir</button>
              <button class="btn-secondary btn-sm" onclick="SyntraCRM._exportarPDF()">📥 Exportar PDF</button>
              <button class="btn-secondary btn-sm" onclick="SyntraCRM._copiarTextoPreview()">📋 Copiar Texto</button>
              <button class="btn-secondary btn-sm" onclick="SyntraCRM._salvarDocumentoAtual('${clienteId}')">💾 Salvar no Perfil</button>
              <button class="btn-ghost btn-sm" onclick="document.getElementById('doc-preview-area').style.display='none'">Fechar</button>
            </div>
          </div>
          <div id="doc-preview-content" class="doc-preview-box"></div>
        </div>
      </div>`;
  },

  // ── Tela global de documentos (sem cliente específico) ──
  _renderDocumentosGlobal() {
    const conf = getNichoConf();
    const info = getNichoInfo();
    const clientes = DB.getClientes();
    const tiposDisponiveis = conf.documentos || NICHO_CONFIG.default.documentos;

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">${icon(ICONS.doc,20)} Documentos</h1>
          <p class="page-desc">${tiposDisponiveis.length} modelos disponíveis para ${info.nome}</p>
        </div>
      </div>

      <div class="card mb-2" style="background:linear-gradient(135deg,rgba(41,121,255,0.08),rgba(124,58,237,0.06));border-color:rgba(41,121,255,0.2)">
        <div class="flex items-center gap-2 mb-1">
          <span style="font-size:1.3rem">💡</span>
          <strong>Como usar os Documentos</strong>
        </div>
        <p class="fs-sm text-muted">Acesse o <strong>perfil de um ${conf.clienteLabel.toLowerCase()}</strong> e clique em "Documentos" para gerar modelos personalizados com os dados já salvos. Ou selecione abaixo.</p>
      </div>

      <div class="col-2 mb-2">
        <div class="card">
          <div class="card-header"><span class="card-title">Gerar Documento Rápido</span></div>
          <div class="form-group">
            <label>${conf.clienteLabel}</label>
            <select id="doc-cliente-select">
              ${clientes.length
                ? clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')
                : '<option value="">— Cadastre clientes primeiro —</option>'}
            </select>
          </div>
          <div class="form-group">
            <label>Tipo de Documento</label>
            <select id="doc-tipo-global">
              ${tiposDisponiveis.map(d => `<option value="${d}">${d}</option>`).join('')}
            </select>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn-primary btn-sm" onclick="SyntraCRM._gerarDocumentoRapido()">
              ${icon(ICONS.doc,14)} Gerar Documento
            </button>
            <button class="btn-secondary btn-sm" onclick="SyntraCRM._gerarEImprimirRapido()">
              🖨 Gerar e Imprimir
            </button>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Modelos Disponíveis</span></div>
          <div style="display:flex;flex-direction:column;gap:5px">
            ${tiposDisponiveis.map(d => `
              <div class="activity-item">
                <div class="activity-dot blue"></div>
                <span class="fs-sm">${d}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div id="doc-preview-area-global" style="display:none" class="card">
        <div class="card-header">
          <span class="card-title">📄 Preview do Documento</span>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn-primary btn-sm" onclick="SyntraCRM._imprimirPreview()">🖨 Imprimir</button>
            <button class="btn-secondary btn-sm" onclick="SyntraCRM._exportarPDF()">📥 Exportar PDF</button>
            <button class="btn-secondary btn-sm" onclick="SyntraCRM._copiarTextoPreview()">📋 Copiar Texto</button>
            <button class="btn-ghost btn-sm" onclick="document.getElementById('doc-preview-area-global').style.display='none'">Fechar</button>
          </div>
        </div>
        <div id="doc-preview-content" class="doc-preview-box"></div>
      </div>`;
  },

  _gerarDocumentoRapido() {
    const cid = document.getElementById('doc-cliente-select')?.value;
    const tipo = document.getElementById('doc-tipo-global')?.value;
    if (!cid || !tipo) { toast('Selecione cliente e tipo', 'error'); return; }
    const c = DB.getClientes().find(x => x.id === cid);
    if (!c) { toast('Cliente não encontrado', 'error'); return; }
    const html = SyntraCRM._gerarConteudoDocumento(tipo, c);
    const preview = document.getElementById('doc-preview-area-global');
    const content = document.getElementById('doc-preview-content');
    if (preview && content) { content.innerHTML = html; preview.style.display = 'block'; preview.scrollIntoView({behavior:'smooth'}); }
    toast('Documento gerado!', 'success');
  },

  _gerarEImprimirRapido() {
    SyntraCRM._gerarDocumentoRapido();
    setTimeout(() => SyntraCRM._imprimirPreview(), 600);
  },

  gerarDocumento(clienteId) {
    const tipo = document.getElementById('doc-tipo-select')?.value;
    if (!tipo) { toast('Selecione o tipo', 'error'); return; }
    const c = DB.getClientes().find(x => x.id === clienteId);
    if (!c) { toast('Cliente não encontrado', 'error'); return; }
    const html = SyntraCRM._gerarConteudoDocumento(tipo, c);
    // Guardar tipo atual para salvar depois
    SyntraCRM._docAtual = { clienteId, tipo, html };
    const preview = document.getElementById('doc-preview-area');
    const content = document.getElementById('doc-preview-content');
    if (preview && content) { content.innerHTML = html; preview.style.display = 'block'; preview.scrollIntoView({behavior:'smooth'}); }
    toast('Documento gerado!', 'success');
  },

  gerarEImprimirDocumento(clienteId) {
    SyntraCRM.gerarDocumento(clienteId);
    setTimeout(() => SyntraCRM._imprimirPreview(), 600);
  },

  _salvarDocumentoAtual(clienteId) {
    if (!SyntraCRM._docAtual) { toast('Gere um documento primeiro', 'error'); return; }
    const { tipo, html } = SyntraCRM._docAtual;
    const docs = DB.getDocumentos(clienteId);
    docs.push({ id: uid(), tipo, html, data: formatDate() });
    DB.setDocumentos(clienteId, docs);
    toast('Documento salvo no perfil!', 'success');
    SyntraCRM.abrirDocumentosPerfil(clienteId);
  },

  visualizarDocumento(clienteId, docId) {
    const docs = DB.getDocumentos(clienteId);
    const doc = docs.find(d => d.id === docId);
    if (!doc) { toast('Documento não encontrado', 'error'); return; }
    SyntraCRM._docAtual = { clienteId, tipo: doc.tipo, html: doc.html };
    const preview = document.getElementById('doc-preview-area');
    const content = document.getElementById('doc-preview-content');
    if (preview && content) { content.innerHTML = doc.html; preview.style.display = 'block'; preview.scrollIntoView({behavior:'smooth'}); }
  },

  imprimirDocumentoSalvo(clienteId, docId) {
    SyntraCRM.visualizarDocumento(clienteId, docId);
    setTimeout(() => SyntraCRM._imprimirPreview(), 400);
  },

  copiarDocumento(clienteId, docId) {
    const docs = DB.getDocumentos(clienteId);
    const doc = docs.find(d => d.id === docId);
    if (!doc) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = doc.html;
    navigator.clipboard.writeText(tmp.textContent || '').then(() => toast('Copiado!', 'success')).catch(() => toast('Erro ao copiar', 'error'));
  },

  excluirDocumento(clienteId, docId) {
    if (!confirm('Excluir documento?')) return;
    DB.setDocumentos(clienteId, DB.getDocumentos(clienteId).filter(d => d.id !== docId));
    toast('Documento excluído', 'info');
    SyntraCRM.abrirDocumentosPerfil(clienteId);
  },

  _imprimirPreview() {
    const content = document.getElementById('doc-preview-content');
    if (!content) { toast('Nenhum documento aberto', 'error'); return; }
    const info = getNichoInfo();
    // Cria janela dedicada para impressão com CSS print-friendly
    const printWin = window.open('', '_blank', 'width=900,height=700');
    printWin.document.write(`<!DOCTYPE html><html lang="pt-BR"><head>
      <meta charset="UTF-8"/>
      <title>Syntra CRM · Documento</title>
      <style>
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Segoe UI',Arial,sans-serif; font-size:13px; color:#111; background:#fff; padding:0; }
        .doc-print-wrap { padding:30px 40px; max-width:800px; margin:0 auto; }
        .doc-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
        .doc-logo { display:flex; align-items:center; gap:10px; }
        .doc-logo-mark { width:36px;height:36px;background:linear-gradient(135deg,#2979FF,#7C3AED);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:16px; }
        .doc-logo-name { font-weight:700; font-size:13px; }
        .doc-logo-sub { font-size:11px; color:#666; }
        .doc-badge { background:#f0f4ff;border:1px solid #2979FF;color:#2979FF;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700; }
        .doc-divider { height:2px;background:linear-gradient(90deg,#2979FF,#7C3AED);margin:14px 0; }
        .doc-section-title { font-size:16px;font-weight:700;margin-bottom:14px;color:#111; }
        .doc-table { width:100%;border-collapse:collapse;margin-bottom:14px; }
        .doc-table th { background:#f5f7fa;padding:8px 10px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#555;border:1px solid #dde; }
        .doc-table td { padding:8px 10px;border:1px solid #dde;vertical-align:top;font-size:12px; }
        .doc-field-label { background:#f9fafc;font-weight:600;color:#555;font-size:11px;white-space:nowrap;width:120px; }
        .doc-obs-box { background:#f9fafc;border:1px solid #dde;border-radius:6px;padding:12px;margin-bottom:12px;font-size:12px;line-height:1.6; }
        .doc-footer { margin-top:40px;padding-top:16px;border-top:2px solid #eee;display:flex;justify-content:space-between;align-items:flex-end; }
        .doc-assinatura { text-align:center; }
        .doc-assinatura-linha { border-top:1px solid #333;width:200px;margin-bottom:6px; }
        .doc-assinatura-nome { font-weight:600;font-size:12px; }
        .doc-assinatura-cargo { font-size:11px;color:#666; }
        .doc-rodape-info { font-size:10px;color:#999;text-align:right;line-height:1.6; }
        @media print {
          body { -webkit-print-color-adjust:exact;print-color-adjust:exact; }
          @page { margin:1.5cm; size:A4; }
        }
      </style>
    </head><body>
      <div class="doc-print-wrap">${content.innerHTML}</div>
      <script>window.onload=function(){window.print();setTimeout(()=>window.close(),1000);};<\/script>
    </body></html>`);
    printWin.document.close();
  },

  _exportarPDF() {
    toast('PDF: use "Imprimir → Salvar como PDF" no diálogo de impressão. Suporte a jsPDF disponível na versão Pro.', 'info');
    setTimeout(() => SyntraCRM._imprimirPreview(), 800);
  },

  _copiarTextoPreview() {
    const content = document.getElementById('doc-preview-content');
    if (!content) { toast('Nenhum documento aberto', 'error'); return; }
    const tmp = document.createElement('div');
    tmp.innerHTML = content.innerHTML;
    navigator.clipboard.writeText(tmp.textContent || '').then(() => toast('Texto copiado!', 'success')).catch(() => toast('Erro ao copiar', 'error'));
  },


  /* ════════ AGENDA ════════ */
  _renderAgenda() {
    const conf=getNichoConf(); const hoje=new Date(); const agenda=DB.getAgenda();
    const horas=[8,9,10,11,12,13,14,15,16,17,18,19];
    return `
      <div class="page-header">
        <div><h1 class="page-title">📅 Agenda</h1><p class="page-desc">${hoje.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p></div>
        <div class="page-actions"><button class="btn-primary btn-sm" onclick="SyntraCRM.abrirModalAgendamento(9)">+ Novo Agendamento</button></div>
      </div>
      <div class="agenda-grid">
        <div class="card" style="padding:0">
          <div class="card-header" style="padding:.7rem 1rem .5rem"><span class="card-title">Hoje · ${conf.atendLabel}s</span><span class="tag blue">${agenda.length} agendado(s)</span></div>
          <div class="agenda-day" style="padding:.5rem">${horas.map(h=>{const item=agenda.find(a=>a.hora===h);return`<div class="agenda-slot"><div class="slot-time">${String(h).padStart(2,'0')}:00</div><div class="slot-content">${item?`<div class="slot-item"><div class="slot-name">${item.nome}</div><div class="slot-service">${item.servico}</div></div>`:`<div class="slot-empty">Livre<button class="btn-ghost btn-sm" style="margin-left:auto" onclick="SyntraCRM.abrirModalAgendamento(${h})">+ Agendar</button></div>`}</div></div>`;}).join('')}</div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Próximos 5 Dias</span></div>
          ${[1,2,3,4,5].map(d=>{const dt=new Date(hoje);dt.setDate(hoje.getDate()+d);const n=Math.floor(Math.random()*4+1);return`<div class="activity-item"><div class="activity-dot blue"></div><div class="activity-main"><div class="activity-text">${dt.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'})}</div><div class="activity-time">${n} agendamento(s)</div></div></div>`;}).join('')}
          <div class="divider"></div>
          <button class="btn-primary btn-sm" onclick="SyntraCRM.abrirModalAgendamento(9)" style="width:100%">+ Novo Agendamento</button>
        </div>
      </div>`;
  },

  abrirModalAgendamento(hora) {
    const conf=getNichoConf(); const clientes=DB.getClientes();
    const opts=clientes.length?clientes.map(c=>`<option value="${c.id}">${c.nome}</option>`).join(''):'<option value="">— Cadastre clientes primeiro —</option>';
    SyntraCRM.abrirModal('Novo Agendamento',`<div class="form-grid"><div class="form-group"><label>${conf.clienteLabel}</label><select id="ag-cliente">${opts}</select></div><div class="form-group"><label>Horário</label><input type="time" id="ag-hora" value="${String(hora).padStart(2,'0')}:00"/></div><div class="form-group span-2"><label>Serviço / Procedimento</label><input type="text" id="ag-servico" placeholder="Ex: Consulta, Sessão, Corte..."/></div></div><div class="modal-actions"><button class="btn-secondary btn-sm" onclick="SyntraCRM.fecharModal()">Cancelar</button><button class="btn-primary btn-sm" onclick="SyntraCRM.salvarAgendamento()">Agendar</button></div>`);
  },

  salvarAgendamento() {
    const cid=(document.getElementById('ag-cliente')?.value||''); const horaStr=(document.getElementById('ag-hora')?.value||'09:00'); const servico=(document.getElementById('ag-servico')?.value||'').trim();
    if(!cid||!servico){toast('Preencha todos os campos','error');return;}
    const c=DB.getClientes().find(x=>x.id===cid); if(!c){toast('Cliente não encontrado','error');return;}
    const hora=parseInt(horaStr.split(':')[0])||9; const agenda=DB.getAgenda();
    const idx=agenda.findIndex(a=>a.hora===hora); const entry={id:uid(),hora,nome:c.nome,servico,clienteId:cid};
    if(idx!==-1)agenda[idx]=entry; else agenda.push(entry);
    DB.setAgenda(agenda); SyntraCRM.fecharModal(); toast('Agendado!','success'); SyntraCRM.navegarPara('Agenda');
  },

  /* ════════ FINANCEIRO ════════ */
  _renderFinanceiro() {
    const fin=DB.getFinanceiro(); const fmt=v=>v.toLocaleString('pt-BR',{minimumFractionDigits:2});
    const total=fin.filter(f=>f.tipo==='receita').reduce((a,b)=>a+(+b.valor||0),0);
    const saidas=fin.filter(f=>f.tipo==='despesa').reduce((a,b)=>a+(+b.valor||0),0);
    return `
      <div class="page-header"><h1 class="page-title">💰 Financeiro</h1><div class="page-actions"><button class="btn-primary btn-sm" onclick="SyntraCRM.abrirModalLancamento()">+ Novo Lançamento</button></div></div>
      <div class="fin-summary">
        <div class="fin-card"><span class="fin-label">Receita Total</span><span class="fin-value green">R$ ${fmt(total)}</span></div>
        <div class="fin-card"><span class="fin-label">Despesas</span><span class="fin-value red">R$ ${fmt(saidas)}</span></div>
        <div class="fin-card"><span class="fin-label">Saldo</span><span class="fin-value gold">R$ ${fmt(total-saidas)}</span></div>
      </div>
      <div class="card" style="padding:0">
        <div class="card-header" style="padding:.7rem 1rem"><span class="card-title">Lançamentos</span></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor</th><th></th></tr></thead>
          <tbody>${fin.length?fin.slice().reverse().map(f=>`<tr><td>${f.data}</td><td>${f.desc}</td><td><span class="status ${f.tipo==='receita'?'status-ativo':'status-inativo'}">${f.tipo}</span></td><td class="${f.tipo==='receita'?'text-green':'text-red'}">R$ ${fmt(+f.valor)}</td><td><button class="btn-icon" onclick="SyntraCRM.excluirLancamento('${f.id}')" title="Excluir">${icon('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>',14)}</button></td></tr>`).join(''):`<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">💰</div><div class="empty-title">Sem lançamentos</div></div></td></tr>`}</tbody>
        </table></div>
      </div>`;
  },
  abrirModalLancamento(){SyntraCRM.abrirModal('Novo Lançamento',`<div class="form-grid"><div class="form-group"><label>Tipo</label><select id="fin-tipo"><option value="receita">Receita</option><option value="despesa">Despesa</option></select></div><div class="form-group"><label>Valor (R$)</label><input type="number" id="fin-valor" placeholder="0.00" step="0.01" min="0"/></div><div class="form-group span-2"><label>Descrição</label><input type="text" id="fin-desc" placeholder="Descreva o lançamento..."/></div></div><div class="modal-actions"><button class="btn-secondary btn-sm" onclick="SyntraCRM.fecharModal()">Cancelar</button><button class="btn-primary btn-sm" onclick="SyntraCRM.salvarLancamento()">Salvar</button></div>`);},
  salvarLancamento(){const tipo=document.getElementById('fin-tipo')?.value;const valor=parseFloat(document.getElementById('fin-valor')?.value||'0');const desc=(document.getElementById('fin-desc')?.value||'').trim();if(!desc||valor<=0){toast('Preencha descrição e valor','error');return;}const fin=DB.getFinanceiro();fin.push({id:uid(),tipo,valor,desc,data:new Date().toLocaleDateString('pt-BR')});DB.setFinanceiro(fin);SyntraCRM.fecharModal();toast('Lançamento salvo!','success');SyntraCRM.navegarPara('Financeiro');},
  excluirLancamento(id){if(!confirm('Excluir lançamento?'))return;DB.setFinanceiro(DB.getFinanceiro().filter(f=>f.id!==id));toast('Excluído','info');SyntraCRM.navegarPara('Financeiro');},

  /* ════════ TAREFAS ════════ */
  _renderTarefas(){const tarefas=DB.getTarefas();const pend=tarefas.filter(t=>!t.done);const conc=tarefas.filter(t=>t.done);return`<div class="page-header"><h1 class="page-title">✅ Tarefas</h1><div class="page-actions"><button class="btn-primary btn-sm" onclick="SyntraCRM.abrirModalNovaTarefa()">+ Nova Tarefa</button></div></div><div class="col-2"><div class="card" style="padding:0"><div class="card-header" style="padding:.7rem 1rem"><span class="card-title">Pendentes</span><span class="tag">${pend.length}</span></div><div>${pend.map(t=>SyntraCRM._renderTarefaItem(t)).join('')||'<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-title">Tudo em dia!</div></div>'}</div></div><div class="card" style="padding:0"><div class="card-header" style="padding:.7rem 1rem"><span class="card-title">Concluídas</span><span class="tag green">${conc.length}</span></div><div>${conc.map(t=>SyntraCRM._renderTarefaItem(t)).join('')||'<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-title">Nenhuma</div></div>'}</div></div></div>`;},
  _renderTarefaItem(t){return`<div class="task-item"><div class="task-check ${t.done?'done':''}" onclick="SyntraCRM.toggleTarefa('${t.id}')">${t.done?icon('<polyline points="20 6 9 17 4 12"/>',10):''}</div><div style="flex:1"><div class="task-text ${t.done?'done':''}">${t.texto}</div><div class="task-meta">${t.data}${t.prazo?' · Prazo: '+t.prazo:''}</div></div><span class="task-prio ${t.prioridade}">${t.prioridade}</span><button class="btn-icon btn-sm" onclick="SyntraCRM.excluirTarefa('${t.id}')" style="color:var(--red)">${icon('<polyline points="3 6 5 6 21 6"/>',13)}</button></div>`;},
  abrirModalNovaTarefa(){SyntraCRM.abrirModal('Nova Tarefa',`<div class="form-group"><label>Tarefa *</label><input type="text" id="t-texto" placeholder="Descreva a tarefa..."/></div><div class="form-grid"><div class="form-group"><label>Prazo</label><input type="date" id="t-prazo"/></div><div class="form-group"><label>Prioridade</label><select id="t-prio"><option value="alta">Alta</option><option value="media" selected>Média</option><option value="baixa">Baixa</option></select></div></div><div class="modal-actions"><button class="btn-secondary btn-sm" onclick="SyntraCRM.fecharModal()">Cancelar</button><button class="btn-primary btn-sm" onclick="SyntraCRM.salvarTarefa()">Salvar</button></div>`);},
  salvarTarefa(){const texto=(document.getElementById('t-texto')?.value||'').trim();if(!texto){toast('Descreva a tarefa','error');return;}const tarefas=DB.getTarefas();tarefas.unshift({id:uid(),texto,prazo:document.getElementById('t-prazo')?.value||'',prioridade:document.getElementById('t-prio')?.value||'media',done:false,data:new Date().toLocaleDateString('pt-BR')});DB.setTarefas(tarefas);SyntraCRM.fecharModal();toast('Tarefa criada!','success');SyntraCRM.navegarPara('Tarefas');},
  toggleTarefa(id){const t=DB.getTarefas();const x=t.find(i=>i.id===id);if(x){x.done=!x.done;DB.setTarefas(t);SyntraCRM.navegarPara('Tarefas');}},
  excluirTarefa(id){DB.setTarefas(DB.getTarefas().filter(t=>t.id!==id));SyntraCRM.navegarPara('Tarefas');},

  /* ════════ IA ════════ */
  _renderIA(){
    const conf=getNichoConf();const info=getNichoInfo();
    const acoes=[{id:'msg_retorno',icone:'📱',titulo:'Mensagem de Retorno',desc:`WhatsApp para ${conf.clienteLabel.toLowerCase()}`},{id:'msg_orcamento',icone:'💰',titulo:'Orçamento/Proposta',desc:'Criar proposta personalizada'},{id:'resumo_atend',icone:'📋',titulo:'Resumo do Atendimento',desc:'Resumo profissional'},{id:'prox_acao',icone:'⚡',titulo:'Próxima Ação',desc:'Melhor próxima ação'},{id:'lembrete',icone:'⏰',titulo:'Criar Lembrete',desc:'Lembrete de follow-up'},{id:'classificar',icone:'🎯',titulo:'Classificar',desc:'Analisar prioridade'},{id:'checklist',icone:'✅',titulo:'Checklist',desc:'Checklist de documentos'},{id:'texto_prof',icone:'✍️',titulo:'Texto Profissional',desc:'E-mail ou comunicado'}];
    return`<div class="page-header"><div><h1 class="page-title">🤖 Central de IA Syntra</h1><p class="page-desc">Adaptada para ${info.nome}</p></div><span class="tag purple">IA · Beta</span></div><div class="card mb-2" style="background:linear-gradient(135deg,rgba(124,58,237,0.1),rgba(41,121,255,0.06));border-color:rgba(124,58,237,0.22)"><div class="flex items-center gap-2 mb-1"><span style="font-size:1.3rem">✨</span><strong>IA Syntra para ${info.nome}</strong></div><p class="fs-sm text-muted">Textos profissionais, resumos e mensagens adaptados ao seu segmento.</p></div><div class="ia-grid">${acoes.map(a=>`<div class="ia-card" onclick="SyntraCRM._executarIA('${a.id}')"><div class="ia-icon">${a.icone}</div><div class="ia-title">${a.titulo}</div><div class="ia-desc">${a.desc}</div></div>`).join('')}</div><div id="ia-resultado"></div>`;
  },

  _executarIA(acao){
    const conf=getNichoConf();const info=getNichoInfo();const c=DB.getClientes()[0]||{};const fn=(c.nome||'[Cliente]').split(' ')[0];
    const resp={
      msg_retorno:`Olá, ${fn}! 👋\n\nPassando para confirmar seu próximo atendimento.\nTudo certo para ${c.retorno||c.proxima_sessao||'a data agendada'}?\n\nQualquer dúvida é só avisar!\n${STATE.userName}`,
      msg_orcamento:`Olá, ${fn}!\n\nSegue orçamento:\n📋 ${c.tratamento||c.procedimento||c.tipo_imovel||'Serviço solicitado'}\n💰 ${c.valor_previsto||c.orcamento||'A confirmar'}\n\nEstou à disposição!\n${STATE.userName}`,
      resumo_atend:`RESUMO DO ATENDIMENTO\n${'─'.repeat(28)}\n${conf.clienteLabel}: ${c.nome||'[Nome]'}\nData: ${new Date().toLocaleDateString('pt-BR')}\nProfissional: ${STATE.userName}\n\nServiço: ${c.tratamento||c.procedimento||c.servico_pref||'Conforme realizado'}\nStatus: ${c.status||'—'}\nObs: ${c.obs||'Sem intercorrências.'}\nRetorno: ${c.retorno||c.proxima_sessao||'A agendar'}`,
      prox_acao:`PRÓXIMA AÇÃO RECOMENDADA\n${'─'.repeat(28)}\n${conf.clienteLabel}: ${c.nome||'[Selecione]'}\nStatus: ${c.status||'—'}\n\n🎯 Ação: Contato de acompanhamento\n📱 Canal: WhatsApp\n⏰ Timing: Próximas 48h\n💡 Abordagem: Amigável + proposta de valor`,
      lembrete:`⏰ LEMBRETE\n${'─'.repeat(28)}\nPara: ${STATE.userName}\nSobre: ${c.nome||'[Cliente]'}\nData: ${c.retorno||c.proxima_sessao||'A definir'}\nAção: Contatar para ${c.tratamento||c.procedimento||'atendimento'}\n📱 ${c.whatsapp||c.telefone||'—'}`,
      classificar:`ANÁLISE DE PRIORIDADE\n${'─'.repeat(28)}\n${conf.clienteLabel}: ${c.nome||'[Selecione]'}\n\n📊 Score: ⭐⭐⭐⭐ (Alto)\n✅ Engajamento ativo\n✅ Histórico positivo\n✅ Boa comunicação\n\n⚡ Prioridade: ALTA\n🎯 Próxima ação: Follow-up imediato`,
      checklist:`CHECKLIST · ${info.nome.toUpperCase()}\n${'─'.repeat(28)}\n${conf.clienteLabel}: ${c.nome||'[Selecione]'}\n\n${conf.timelineTypes.map((t,i)=>`${i+1}. ${t}`).join('\n')}`,
      texto_prof:`Prezado(a) ${fn},\n\nEsperamos que esteja bem.\n\nInformamos sobre o andamento do seu atendimento em nossa ${info.nome.toLowerCase()}.\n\nPróximo retorno previsto: ${c.retorno||c.proxima_sessao||'em breve'}.\n\nEstamos à disposição.\n\nAtenciosamente,\n${STATE.userName} · ${info.nome}`,
    };
    const texto=resp[acao]||'Resposta gerada pela IA Syntra.';
    const resultado=document.getElementById('ia-resultado');
    if(resultado){resultado.innerHTML=`<div class="ia-result mt-2"><div class="ia-result-header">${icon(ICONS.ia,15)} Resultado da IA Syntra</div><div class="ia-result-text" id="ia-texto-resultado">${texto}</div><div style="margin-top:.75rem;display:flex;gap:7px;flex-wrap:wrap"><button class="btn-primary btn-sm" onclick="SyntraCRM._copiarIA()">Copiar</button><button class="btn-secondary btn-sm" onclick="document.getElementById('ia-resultado').innerHTML=''">Limpar</button></div></div>`;resultado.scrollIntoView({behavior:'smooth'});}
    toast('Texto gerado!','success');
  },
  _copiarIA(){const el=document.getElementById('ia-texto-resultado');if(!el)return;navigator.clipboard.writeText(el.textContent).then(()=>toast('Copiado!','success')).catch(()=>toast('Erro ao copiar','error'));},

  /* ════════ IMPORTAR ════════ */
  _renderImportar(){
    return`<div class="page-header"><div><h1 class="page-title">📥 Importar Dados</h1><p class="page-desc">Migre sua base de planilhas ou outros sistemas</p></div></div>
    <div class="card mb-2" style="background:linear-gradient(135deg,rgba(201,168,76,0.08),rgba(41,121,255,0.06));border-color:rgba(201,168,76,0.22)"><div class="flex items-center gap-2 mb-1"><span style="font-size:1.2rem">💡</span><strong>Diferencial Syntra</strong></div><p class="fs-sm text-muted">Tem dados em planilha, Google Sheets ou outro sistema? <strong style="color:var(--gold-light)">A Syntra importa tudo para o seu CRM.</strong></p></div>
    <div class="import-steps mb-2"><div class="import-step active"><div class="import-step-num">1</div><span>Colar CSV</span></div><div class="import-step-arrow">→</div><div class="import-step"><div class="import-step-num">2</div><span>Pré-visualizar</span></div><div class="import-step-arrow">→</div><div class="import-step"><div class="import-step-num">3</div><span>Importar</span></div></div>
    <div class="card"><div class="card-header"><span class="card-title">Cole seus dados CSV</span></div><p class="fs-sm text-muted mb-1">Formato: <code style="background:rgba(255,255,255,0.07);padding:2px 6px;border-radius:4px">Nome,Telefone,Email,Cidade,Status,Observação</code></p><div class="form-group"><textarea id="import-csv" rows="8" placeholder="Cole aqui...&#10;Ana Silva,11999990000,ana@email.com,São Paulo,Ativo,Cliente VIP&#10;João Santos,21988880000,joao@email.com,Rio de Janeiro,Novo,Indicação"></textarea></div><div id="import-preview" style="display:none;margin-bottom:1rem"><div class="card-header" style="padding:0 0 .5rem"><span class="card-title">Pré-visualização</span></div><div id="import-table-preview" class="table-wrap"></div></div><div class="flex gap-1 flex-wrap"><button class="btn-secondary btn-sm" onclick="SyntraCRM._previewImport()">👁 Pré-visualizar</button><button class="btn-primary btn-sm" onclick="SyntraCRM._executarImport()">⬇ Importar</button><button class="btn-ghost btn-sm" onclick="SyntraCRM._carregarExemplo()">Carregar Exemplo</button></div></div>`;
  },
  _carregarExemplo(){const el=document.getElementById('import-csv');if(el)el.value=`Ana Silva,11999990000,ana@email.com,São Paulo,Ativo,Cliente VIP\nJoão Santos,21988880000,joao@email.com,Rio de Janeiro,Novo,Indicação\nMaria Costa,11977770000,maria@email.com,Campinas,Pendente,Aguardando`;toast('Exemplo carregado!','info');},
  _previewImport(){const csv=(document.getElementById('import-csv')?.value||'').trim();if(!csv){toast('Cole dados CSV','error');return;}const linhas=csv.split('\n').filter(l=>l.trim());const prev=document.getElementById('import-preview');document.getElementById('import-table-preview').innerHTML=`<table><thead><tr><th>Nome</th><th>Telefone</th><th>Email</th><th>Cidade</th><th>Status</th><th>Obs</th></tr></thead><tbody>${linhas.map(l=>`<tr>${l.split(',').map(c=>`<td>${c.trim()||'—'}</td>`).join('')}</tr>`).join('')}</tbody></table>`;if(prev)prev.style.display='block';toast(`${linhas.length} linha(s) detectada(s)`,'info');},
  _executarImport(){const csv=(document.getElementById('import-csv')?.value||'').trim();if(!csv){toast('Cole dados CSV','error');return;}const linhas=csv.split('\n').filter(l=>l.trim());const clientes=DB.getClientes();let n=0;linhas.forEach(linha=>{const[nome,telefone,email,cidade,status,obs]=linha.split(',').map(v=>(v||'').trim());if(!nome)return;if(!clientes.some(c=>c.nome.toLowerCase()===nome.toLowerCase())){clientes.unshift({id:uid(),nome,telefone:telefone||'',whatsapp:telefone||'',email:email||'',cidade:cidade||'',status:status||'Novo',obs:obs||'',origem:'Importação',criadoEm:new Date().toLocaleDateString('pt-BR')});n++;}});DB.setClientes(clientes);toast(`✅ ${n} registro(s) importado(s)!`,'success');const el=document.getElementById('import-csv');if(el)el.value='';const prev=document.getElementById('import-preview');if(prev)prev.style.display='none';setTimeout(()=>SyntraCRM.navegarPara(getMenuListagem()),1200);},

  /* ════════ RELATÓRIOS ════════ */
  _renderRelatorios(){
    const clientes=DB.getClientes();const sc={};clientes.forEach(c=>{const s=c.status||'—';sc[s]=(sc[s]||0)+1;});
    const fin=DB.getFinanceiro();const receita=fin.filter(f=>f.tipo==='receita').reduce((a,b)=>a+(+b.valor||0),0);
    return`<div class="page-header"><h1 class="page-title">📊 Relatórios</h1><div class="page-actions"><button class="btn-secondary btn-sm" onclick="window.print()">🖨 Imprimir</button></div></div>
    <div class="col-2 mb-2"><div class="card"><div class="card-header"><span class="card-title">Por Status</span></div>${Object.entries(sc).map(([s,n])=>`<div class="activity-item"><div class="activity-dot blue"></div><div class="activity-main"><div class="activity-text">${s}</div></div><strong>${n}</strong></div>`).join('')||'<div class="empty-state"><div class="empty-title">Sem dados</div></div>'}</div>
    <div class="card"><div class="card-header"><span class="card-title">Financeiro</span></div><div class="fin-card mb-1"><span class="fin-label">Receita</span><span class="fin-value green">R$ ${receita.toLocaleString('pt-BR',{minimumFractionDigits:2})}</span></div><div class="fin-card"><span class="fin-label">Registros</span><span class="fin-value">${clientes.length}</span></div></div></div>
    <div class="card"><div class="card-header"><span class="card-title">Evolução</span></div>${SyntraCRM._renderBarChart()}<div class="bar-labels">${['Jan','Fev','Mar','Abr','Mai','Jun'].map(l=>`<span class="bar-label">${l}</span>`).join('')}</div></div>`;
  },

  /* ════════ CONFIG ════════ */
  _renderConfig(){
    return`<div class="page-header"><h1 class="page-title">⚙️ Configurações</h1></div>
    <div class="col-2">
      <div class="card"><div class="card-header"><span class="card-title">Conta</span></div>
        <div class="form-group"><label>Nome</label><input type="text" id="conf-nome" value="${STATE.userName}"/></div>
        <div class="form-group"><label>Matrícula</label><input type="text" value="${STATE.userId}" disabled/></div>
        <div class="form-group"><label>Tipo de Conta</label><select id="conf-tipo"><option value="PF" ${STATE.tipoConta==='PF'?'selected':''}>PF · Profissional</option><option value="PJ" ${STATE.tipoConta==='PJ'?'selected':''}>PJ · Empresa</option></select></div>
        <button class="btn-primary btn-sm" onclick="SyntraCRM.salvarConfig()">Salvar</button>
      </div>
      <div class="card"><div class="card-header"><span class="card-title">Dados & Privacidade</span></div>
        <p class="fs-sm text-muted mb-2">Dados isolados por matrícula + nicho.</p>
        <div class="form-group"><label>Nicho Atual</label><input type="text" value="${getNichoInfo().nome}" disabled/></div>
        <div style="display:flex;flex-direction:column;gap:7px;margin-top:.75rem">
          <button class="btn-secondary btn-sm" onclick="SyntraCRM.trocarNicho()">🔄 Trocar Nicho</button>
          <button class="btn-danger btn-sm" onclick="SyntraCRM._resetarDados()">🗑 Resetar Dados</button>
        </div>
      </div>
    </div>
    <div class="card mt-2"><div class="card-header"><span class="card-title">🚀 Roadmap Syntra CRM</span></div><div class="col-2 mt-1">${[['🔐 Supabase Auth','Login real por empresa'],['🗄 Banco por Empresa','Dados isolados no backend'],['📁 Supabase Storage','Upload real de arquivos'],['🌐 Domínio Próprio','CRM com seu domínio'],['👥 Multiusuário','Múltiplos profissionais'],['💳 Planos SaaS','Free, Pro e Enterprise']].map(([t,d])=>`<div class="activity-item"><div class="activity-dot blue"></div><div class="activity-main"><div class="fw-600 fs-sm">${t}</div><div class="text-muted fs-sm">${d}</div></div><span class="tag">Em breve</span></div>`).join('')}</div></div>`;
  },
  salvarConfig(){const nome=(document.getElementById('conf-nome')?.value||'').trim()||STATE.userName;const tipo=document.getElementById('conf-tipo')?.value||STATE.tipoConta;STATE.userName=nome;STATE.tipoConta=tipo;DB.setNome(nome);DB.setTipoConta(tipo);const un=document.getElementById('sidebar-username');if(un)un.textContent=nome;['topbar-avatar','sidebar-avatar'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=nome.charAt(0).toUpperCase();});const tl=document.getElementById('sidebar-tipo-label');if(tl)tl.textContent=`${tipo} · ${nome.split(' ')[0]}`;toast('Configurações salvas!','success');},
  _resetarDados(){if(!confirm('Resetar dados deste nicho?'))return;DB.resetNicho();SyntraCRM._inicializarDemoData();DB.marcarInicializado();toast('Dados resetados!','info');SyntraCRM.navegarPara('Dashboard');},

  /* ════════ GENÉRICO ════════ */
  _renderGenerico(modulo){const conf=getNichoConf();const info=getNichoInfo();return`<div class="page-header"><h1 class="page-title">${modulo}</h1><div class="page-actions"><button class="btn-primary btn-sm" onclick="SyntraCRM.abrirModalNovoCliente()">+ Novo Registro</button></div></div><div class="card"><div class="empty-state"><div class="empty-icon">${info.icone}</div><div class="empty-title">${modulo}</div><div class="empty-desc">Módulo disponível na versão completa. Cadastre ${conf.clientesLabel.toLowerCase()} para começar.</div><button class="btn-primary btn-sm mt-2" onclick="SyntraCRM.abrirModalNovoCliente()">Novo ${conf.clienteLabel}</button></div></div>`;},

  /* ════════ BUSCA GLOBAL ════════ */
  buscaGlobal(q){
    const overlay=document.getElementById('search-results-overlay');const box=document.getElementById('search-results-box');if(!overlay||!box)return;
    if(!q||q.length<2){overlay.classList.add('hidden');return;}
    const ql=q.toLowerCase();const results=DB.getClientes().filter(c=>Object.values(c).some(v=>String(v).toLowerCase().includes(ql))).slice(0,8);
    overlay.classList.remove('hidden');
    box.innerHTML=results.length?results.map(c=>`<div class="search-result-item" onclick="SyntraCRM._irParaResultado('${c.id}')"><div class="sri-icon">${(c.nome||'?').charAt(0).toUpperCase()}</div><div class="sri-main"><div class="sri-name">${c.nome}</div><div class="sri-meta">${c.telefone||c.email||c.cidade||'—'}</div></div><span class="sri-badge">${c.status||'—'}</span></div>`).join(''):`<div class="search-result-item"><div class="sri-main"><div class="sri-name text-muted">Nenhum resultado para "${q}"</div></div></div>`;
  },
  _irParaResultado(id){const o=document.getElementById('search-results-overlay');const i=document.getElementById('search-global-input');if(o)o.classList.add('hidden');if(i)i.value='';SyntraCRM.abrirPerfil(id);},

  /* ════════ INIT DEMO ════════ */
  _inicializarDemoData(){
    const key=STATE.nichoId;const base=DEMO_CLIENTES_BASE[key]||DEMO_CLIENTES_BASE.dentista;const conf=getNichoConf();const types=conf.timelineTypes||['Atendimento','Nota'];
    const clientes=base.map(c=>({...c,id:uid(),criadoEm:new Date().toLocaleDateString('pt-BR')}));
    DB.setClientes(clientes);
    clientes.forEach(c=>{DB.setTimeline(c.id,[{id:uid(),tipo:types[0],texto:`Primeiro atendimento. ${c.obs||''}`,data:new Date().toLocaleDateString('pt-BR')},{id:uid(),tipo:types[1]||'Nota',texto:'Acompanhamento em andamento.',data:new Date(Date.now()-86400000).toLocaleDateString('pt-BR')}]);});
    DB.setTarefas([{id:uid(),texto:`Confirmar retorno de ${clientes[0]?.nome||'cliente'}`,prazo:'',prioridade:'alta',done:false,data:new Date().toLocaleDateString('pt-BR')},{id:uid(),texto:'Atualizar cadastros pendentes',prazo:'',prioridade:'media',done:false,data:new Date().toLocaleDateString('pt-BR')},{id:uid(),texto:'Enviar orçamentos',prazo:'',prioridade:'media',done:true,data:new Date().toLocaleDateString('pt-BR')}]);
    DB.setFinanceiro([{id:uid(),tipo:'receita',valor:350,desc:`Atendimento · ${clientes[0]?.nome||'cliente'}`,data:new Date().toLocaleDateString('pt-BR')},{id:uid(),tipo:'receita',valor:280,desc:`Serviço · ${clientes[1]?.nome||'cliente 2'}`,data:new Date().toLocaleDateString('pt-BR')},{id:uid(),tipo:'despesa',valor:120,desc:'Material / Insumos',data:new Date().toLocaleDateString('pt-BR')}]);
    DB.setAgenda([{id:uid(),hora:9,nome:clientes[0]?.nome||'Cliente 1',servico:conf.atendLabel||'Atendimento',clienteId:clientes[0]?.id},{id:uid(),hora:11,nome:clientes[1]?.nome||'Cliente 2',servico:'Retorno',clienteId:clientes[1]?.id},{id:uid(),hora:14,nome:clientes[0]?.nome||'Cliente 1',servico:'Procedimento',clienteId:clientes[0]?.id}]);
  },

  /* ════════ LOGOUT ════════ */
  logout(){if(!confirm('Sair da plataforma?'))return;STATE.userId=STATE.userName=STATE.tipoConta=STATE.nichoId=null;STATE.moduloAtivo='Dashboard';STATE.clienteAbertoId=null;const m=document.getElementById('login-matricula');const s=document.getElementById('login-senha');if(m)m.value='';if(s)s.value='';setScreen('screen-login');toast('Até logo!','info');},
};

/* ═══════════════ INIT ═══════════════ */
document.addEventListener('DOMContentLoaded',()=>{
  ['login-matricula','login-senha'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('keydown',e=>{if(e.key==='Enter')SyntraCRM.fazerLogin();});});

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      const mo=document.getElementById('modal-overlay');if(mo&&!mo.classList.contains('hidden')){SyntraCRM.fecharModal();return;}
      const bgo=document.getElementById('search-results-overlay');if(bgo&&!bgo.classList.contains('hidden')){bgo.classList.add('hidden');const bgi=document.getElementById('search-global-input');if(bgi)bgi.value='';}
    }
  });

  const mo=document.getElementById('modal-overlay');if(mo)mo.addEventListener('click',e=>{if(e.target===mo)SyntraCRM.fecharModal();});

  document.addEventListener('click',e=>{const bgo=document.getElementById('search-results-overlay');const bgi=document.getElementById('search-global-input');if(bgo&&!bgo.classList.contains('hidden')&&bgi&&!bgo.contains(e.target)&&e.target!==bgi)bgo.classList.add('hidden');});

  document.addEventListener('click',e=>{const sb=document.getElementById('sidebar');const mm=document.querySelector('.mobile-menu');if(window.innerWidth<=900&&sb&&sb.classList.contains('mobile-open'))if(!sb.contains(e.target)&&(!mm||!mm.contains(e.target)))sb.classList.remove('mobile-open');});

  SyntraCRM._renderizarNichoGrid();
  setScreen('screen-login');
});
