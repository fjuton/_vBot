Bot administacyjny oparty na frameworku ESX do modyfikacji FiveM pisany w Js/Lua

Odrazu napisze że dopiero się zapoznaje z językiem Javascript więc wszelkie znalezione błędy prosiłbym zgłaszać :)

1. Bot działa tylko po pobraniu biblioteki `discord.js` v12-dev lub niżej.
2. W config.json warto zmienić wszelkie konfiguracje dotyczące bota :)
3. **WAŻNE** Ustawcie sobie waszego bota na PRYWATNY!!!
4. Zmiencie sobie wszystkie zapytania MYSQL w bot.js linijka `54`
5. Bot działa tylko i wyłącznie na frameworku ESX (chyba ze sobie przepiszecie to już inna sprawa :) )
6. Wszystkie triggery odnośnie komend `!revive` polecałbym zmienić w `lua/server.lua`
7. Status aktualizuje się co 5 sekund możliwość zmiany po `lua/server.lua:7`

Co posiada bot?

Spis komend:


!addwl steam

!revive id

!ustawprace id praca

!kick id

!message id wiadomosc

!additem id item

!info id

!help
