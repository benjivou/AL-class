package com.example.myapplication.ui.models

import java.util.*

class Ticket(val id: Int,
             val controller: String,
             val passengerName: String,
             val type: String,
             val trainRef: String,
             val departure: String,
             val destination: String,
             val price: Int,
             val date: Date)
