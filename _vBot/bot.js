

const Discord = require("discord.js");
const mysql = require("mysql");
const config = require("./config.json");
const client = new Discord.Client();

let prefix = "!";
let connection = mysql.createConnection({
    host     : config.mysql.host,
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
});

connection.connect();


client.on("ready", () => {
    let players = GetNumPlayerIndices();
    console.log("\n\n[_vBot] Połączono z Discordem ^3<=>^7");
    console.log("[_vBot] Liczba graczy na serwerze: ^2" + players + "^7\n\n");

    sendEmbed({
        channel: config.logchannel,
        author: 'Połączono z discordem',
        description: 'Serwer został włączony!'
    });
 
});

client.on("message", message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command == '!help')
    {
        
        sendEmbed({
            channel: message.channel.id,
            author: 'KOMENDY',
            description: 'Komendy bota\n!addwl {steam} - dodawanie kogoś na whiteliste\n!ustawprace {id} {praca} - ustawia prace dla id\n!revive {id} - uzdrawia gracza\n!kick {id} - wyrzuca gracza z serwera\n!info {id} - informacje o graczu\n!additem {id} {item} - dodaje item dla gracza\n!message {id} {wiadomosc} - wysyła wiadomość prywatna dla gracza' 
        });
    }

    if (command == '!addwl')
    {
        if (message.member.hasPermission("ADMINISTRATOR"))
        {
            let steam = args[0];
            connection.query(`INSERT into wl (\`steam\`) VALUES ("${steam}")`, function (error, results, fields) {
                if (error) throw error;
            });

            sendEmbed({
                channel: message.channel.id,
                author: 'Dodano do bazy danych',
                description: 'Steam: **' + steam + '**'
            });

            sendEmbed({
                channel: config.logchannel,
                author: 'Dodał do bazy danych',
                description: 'Dodał: **' + message.author + '**\nSteam: **' + steam + '**' 
            });
        } else {
            sendEmbed({
                channel: message.channel.id,
                author: 'Nie masz permisji!',
                description: 'Nie posiadasz permisji aby dodać do bazy danych\nWymagane permisje: **"ADMINISTRATOR"**' 
            });
        }
    }

    if (command == '!ustawprace')
    {
        if (message.member.hasPermission("ADMINISTRATOR"))
        {
            
            let userid = args[0];

            if (args[0] === undefined || args[0] == "")
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }

            if (GetPlayerName(args[0]) === null)
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }

            emit("bot:ustawPrace", args[0], args[1])

            sendEmbed({
                channel: message.channel.id,
                author: 'Ustawiono prace',
                description: 'Ustawiłeś **' + args[1] + '** dla id: **' + args[0] + '**',
                color: '#00c3ff'
            });

            sendEmbed({
                channel: config.logchannel,
                author: 'Ustawił prace',
                description: 'Admin: **' + message.author + '** ustawił **' + args[1] + '** dla id: **' + args[0] + '**',
                color: '#00c3ff'
            });
            
        } 
        else {
            sendEmbed({
                channel: message.channel.id,
                author: 'Nie masz permisji!',
                description: 'Nie posiadasz permisji aby dodać do bazy danych\nWymagane permisje: **"ADMINISTRATOR"**' 
            });
        }

    }

    if (command == '!revive')
    {
        if (message.member.hasPermission("ADMINISTRATOR"))
        {
            
            let userid = args[0];
            if (args[0] === undefined || args[0] == "")
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }

            if (GetPlayerName(args[0]) === null)
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }


            emit("bot:revive", args[0]);

            sendEmbed({
                 channel: message.channel.id,
                 author: 'zRevivowano gracza',
                 description: 'zRevivowałeś id **' + args[0] + '** o nicku: **' + GetPlayerName(args[0]) + '**',
                 color: '#00c3ff'
            });


            sendEmbed({
                channel: config.logchannel,
                author: 'zRevivował gracza',
                description: 'Admin: **' + message.author + '** zrevivował id **' + args[0] + '** o nicku: **' + GetPlayerName(args[0]) + '**',
                color: '#00c3ff'
            });
            
        } 
        else {
            sendEmbed({
                channel: message.channel.id,
                author: 'Nie masz permisji!',
                description: 'Nie posiadasz permisji aby dodać do bazy danych\nWymagane permisje: **"ADMINISTRATOR"**',
                color: '#ff0000'
            });
        }

    }

    if (command == '!kick')
    {
        if (message.member.hasPermission("ADMINISTRATOR"))
        {

            let userid = args[0];
            if (args[0] === undefined || args[0] == "")
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }

            if (GetPlayerName(args[0]) === null)
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }



            sendEmbed({
                channel: message.channel.id,
                author: 'Kicknąłeś gracza',
                description: 'Kicknąłeś id **' + args[0] + '** o nicku: **' + GetPlayerName(args[0]) + '**',
                color: '#ffd500'
            });


            sendEmbed({
                channel: config.logchannel,
                author: 'Kicknął gracza',
                description: 'Admin: **' + message.author + '** kicknał id **' + args[0] + '** o nicku: **' + GetPlayerName(args[0]) + '**',
                color: '#ffd500'
            });

            emit('bot:kick', args[0], message.author.username);

        }

        else {
            sendEmbed({
                channel: message.channel.id,
                author: 'Nie masz permisji!',
                description: 'Nie posiadasz permisji aby dodać do bazy danych\nWymagane permisje: **"ADMINISTRATOR"**' 
            });
        }
    }

    if (command == '!info')
    {
        if (message.member.hasPermission("ADMINISTRATOR"))
        {
            let userid = args[0];
            if (args[0] === undefined || args[0] == "")
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }

            if (GetPlayerName(args[0]) === null)
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }


            let name = GetPlayerName(userid);
            let steam = '';
            let license = '';

            for (let i = 0; i < GetNumPlayerIdentifiers(userid); i++) {
                const identifier = GetPlayerIdentifier(userid, i);
    
                if (identifier.includes('steam:')) {
                    steam = identifier;
                }

                if (identifier.includes('license:')) {
                    license = identifier;
                }
            }
    

            sendEmbed({
                channel: message.channel.id,
                author: 'INFO O GRACZU',
                description: 'ID: **' + userid + '**\nNick: **' + name + '**\nSteam: **' + steam + '**\nLicencja Rockstar: **' + license + '**', 
                color: '#0095ff'
            });
        }
    }

    if (command == "!additem")
    {
        if (message.member.hasPermission("ADMINISTRATOR"))
        {

            let userid = args[0];
            if (args[0] === undefined || args[0] == "" || args[1] === undefined)
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }

            if (GetPlayerName(args[0]) === null)
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }



            sendEmbed({
                channel: message.channel.id,
                author: 'Dałeś item dla gracza',
                description: 'Dałeś item dla id **' + args[0] + '** o nicku: **' + GetPlayerName(args[0]) + '**',
                color: '#ffd500'
            });


            sendEmbed({
                channel: config.logchannel,
                author: 'Dał item dla gracza',
                description: 'Admin: **' + message.author + '** dał item id **' + args[0] + '** o nicku: **' + GetPlayerName(args[0]) + '**',
                color: '#ffd500'
            });

            emit('bot:addItem', args[0], args[1]);

        }

        else {
            sendEmbed({
                channel: message.channel.id,
                author: 'Nie masz permisji!',
                description: 'Nie posiadasz permisji aby dodać do bazy danych\nWymagane permisje: **"ADMINISTRATOR"**' 
            });
        }
    }


    if (command == '!message')
    {
        if (message.member.hasPermission("ADMINISTRATOR"))
        {

            if (args[1] === undefined)
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'BRAK ARGUMENTÓW',
                    color: '#ff0000'
                }); 
            }

            if (args[0] === undefined || args[0] == "")
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }

            if (GetPlayerName(args[0]) === null)
            {
                return sendEmbed({
                    channel: message.channel.id,
                    author: 'NIE ZNALEZIONO GRACZA',
                    description: 'Nie ma takiego gracza na serwerze',
                    color: '#ff0000'
                }); 
            }
            let reason = args.slice(1).join(" ");
            emit("bot:showMessage", args[0], reason, message.author.username + "#" + message.author.discriminator);

            sendEmbed({
                channel: message.channel.id,
                author: 'Wysłano wiadomość!',
                description: 'Wysłałeś wiadomość do gracza: **' + GetPlayerName(args[0]) + '**'
            }); 

        } else {
            sendEmbed({
                channel: message.channel.id,
                author: 'Nie masz permisji!',
                description: 'Nie posiadasz permisji aby dodać do bazy danych\nWymagane permisje: **"ADMINISTRATOR"**' 
            });
        }
    }



});



onNet("bot:aktualizuj", () => {
    let players = GetNumPlayerIndices();
    let maxplayers = GetConvar("sv_maxclients", 32);
    client.user.setActivity(players + '/'+ maxplayers +' osób na serwerze');
});


function sendEmbed(data) {
    let channel = client.channels.get(data.channel);
    const embed = new Discord.MessageEmbed()
        .setAuthor(data.author)
        .setDescription(data.description)
        .setColor(data.color)
        .setTimestamp()
        .setFooter('_vBot ~ 2020-2020');


    channel.send(embed);

}





client.login(config.token);