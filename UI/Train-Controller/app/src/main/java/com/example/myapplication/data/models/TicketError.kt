package com.example.myapplication.data.models

import java.io.Serializable

class TicketError (
    error: String,

):Serializable{
    var error: String = ""
    override fun toString(): String {
        return "Message: $error\n"
    }
}