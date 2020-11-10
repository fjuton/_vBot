ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

Citizen.CreateThread(function()
    while true do
        Wait(5000)

        TriggerEvent("bot:aktualizuj")

    end
end)

AddEventHandler("bot:ustawPrace", function(id, praca)
    local xPlayer = ESX.GetPlayerFromId(id)
    xPlayer.setJob(praca, 0)
end)

AddEventHandler("bot:revive", function(id)
    TriggerEvent("esx_ambulancejob:revive", id)
end)

AddEventHandler("bot:kick", function(id, kickedBy)
    DropPlayer(id, 'Zostałeś wyrzucony przez ' .. kickedBy)
end)

AddEventHandler("bot:addItem", function(id, item)
    local xPlayer = ESX.GetPlayerFromId(id)
    xPlayer.addInventoryItem(item, 1)
end)

AddEventHandler("bot:showMessage", function(id, message, admin)
    local xPlayer = ESX.GetPlayerFromId(id)
    xPlayer.showNotification('Wiadomośc od ~r~' .. admin .. '~w~\n' .. message)
end)

