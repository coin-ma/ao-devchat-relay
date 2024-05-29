function OwnerOrSelf(fn)
    return function(msg)
        if msg.From ~= Owner and msg.From ~= ao.id then
            return false
        end
        return fn(msg)
    end
end

Handlers.add(
    "RelayDiscordMessage",
    OwnerOrSelf(Handlers.utils.hasMatchingTag("Action", "RelayDiscordMessage")),
    function(m)
        local text = m.Data
        local chatRoom = m.ChatRoom
        ao.send({ Target = chatRoom, Action = "Broadcast", Data = text })
    end
)

Handlers.add(
    'Register', OwnerOrSelf(Handlers.utils.hasMatchingTag('Action', 'Register')), function(m)
        local chatRoom = m.ChatRoom
        ao.send({ Target = chatRoom, Action = "Register", Nickname = ao.id })
        return (
            "Registering with room " .. chatRoom)
    end

)
