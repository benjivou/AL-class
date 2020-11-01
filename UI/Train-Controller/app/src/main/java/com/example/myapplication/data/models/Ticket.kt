package com.example.myapplication.data.models

import android.os.Build
import androidx.annotation.RequiresApi
import java.io.Serializable
import java.lang.reflect.Array.get
import java.time.LocalDate
import java.util.*

class Ticket : Serializable{
    var id: String = ""

    var controller: String = ""

    var passengerName: String = ""

    var type: String = ""

    var trainRef: String = ""

    var departure: String = ""

    var destination: String = ""

    var price: Float = 0.0F

    @RequiresApi(Build.VERSION_CODES.O)
    var date: LocalDate = LocalDate.MIN

    override fun toString(): String {
        return "Id: "+this.id +"\nController Id: "+this.controller+"\nPassenger Name: "+this.passengerName+
                "\nType: "+this.type + "\nTrain reference: "+this.trainRef+"\nDeparture: "+this.departure+
                "\nDestination: "+this.destination+"\nPrice: "+this.price+"\nDate: "+this.date
    }
}

