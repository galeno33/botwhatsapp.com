const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// Verifica se há uma sessão salva
let sessionData;
if (fs.existsSync('./session.json')) {
    sessionData = require('./session.json');
}

// Cria uma nova instância do cliente com a sessão carregada (se disponível)
const client = new Client({
    session: sessionData // Usa a sessão salva se existir
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    // Gera e exibe o QR code no terminal para escaneamento pelo WhatsApp
    qrcode.generate(qr, { small: true });
});

//Quando você escanear o QR code pela primeira vez, o evento authenticated será disparado
client.on('authenticated', (session) => {
    console.log('Sessão autenticada:', session);

    if (!session) {
        console.error('Erro: Sessão está undefined.');
        return;
    }

    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
    console.log('Sessão autenticada e salva com sucesso.');
});


client.on('auth_failure', () => {
    console.log('Falha na autenticação, por favor, reescaneie o QR code.');
});

client.on('disconnected', () => {
    // Deleta a sessão ao desconectar
    fs.unlinkSync('./session.json');
    console.log('Sessão desconectada, arquivo de sessão removido.');
    client.destroy();
    client.initialize(); // Tenta reiniciar o cliente
});

client.on('message_create', message => {
    // Responde a qualquer mensagem recebida com o menu de opções
    client.sendMessage(message.from, 
        'Olá, seja bem-vindo ao [Nome do Salão]! Eu sou o seu assistente virtual. Como posso ajudar você hoje? Por favor, escolha uma das opções abaixo:\n'
        + '1️⃣ - Agendar uma maquiagem\n'
        + '2️⃣ - Agendar uma limpeza de pele\n'
        + '3️⃣ - Agendar uma sessão de massagem\n'
        + '4️⃣ - Agendar um design de sobrancelhas\n'
        + '5️⃣ - Consultar preços e pacotes promocionais\n'
        + '6️⃣ - Falar com uma de nossas profissionais\n'
        + '0️⃣ - Para voltar ao menu principal'
    );

    if (message.body.toLocaleLowerCase() === '1') {
        client.sendMessage(message.from, 
            '1️⃣ Agendar Maquiagem:\n Ótima escolha! Por favor, me informe a data e horário desejados para agendarmos sua maquiagem.'
        );
    }

    if (message.body.toLocaleLowerCase() === '2') {
        client.sendMessage(message.from, 
            '2️⃣ Agendar Limpeza de Pele:\n Que maravilha! Qual seria o melhor dia e horário para você realizar sua limpeza de pele?'
        );
    }

    if (message.body.toLocaleLowerCase() === '3') {
        client.sendMessage(message.from, 
            '3️⃣ Agendar Sessão de Massagem:\n Relaxe e deixe tudo comigo! Qual o melhor dia e horário para agendarmos sua sessão de massagem?'
        );
    }

    if (message.body.toLocaleLowerCase() === '4') {
        client.sendMessage(message.from, 
            '4️⃣ Agendar Design de Sobrancelhas:\n Cuidar das sobrancelhas é essencial! Me avise o dia e horário que prefere para agendarmos o design de sobrancelhas.'
        );
    }

    if (message.body.toLocaleLowerCase() === '5') {
        client.sendMessage(message.from, 
            '5️⃣ Consultar Preços e Pacotes Promocionais:\n Temos várias opções para você! Vou enviar uma lista com nossos serviços e pacotes promocionais. Por favor, aguarde um momento.'
        );
    }

    if (message.body.toLocaleLowerCase() === '6') {
        client.sendMessage(message.from, 
            '6️⃣ Falar com uma Profissional:\n Vou encaminhar sua solicitação para uma de nossas profissionais. Em breve, ela entrará em contato com você. Por favor, me informe o seu nome e o melhor horário para o contato.'
        );
    }

    if (message.body.toLocaleLowerCase() === '0') {
        client.sendMessage(message.from, 
            '0️⃣ Menu Principal:\n Você voltou ao menu principal. Como posso ajudar você hoje? Escolha uma das opções abaixo.'
        );
    }
});

// Inicializa o cliente do WhatsApp
client.initialize();
