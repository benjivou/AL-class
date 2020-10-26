package com.example.myapplication.data

import android.util.Log
import com.androidnetworking.AndroidNetworking
import com.androidnetworking.error.ANError
import com.androidnetworking.interfaces.JSONArrayRequestListener
import com.example.myapplication.data.models.Ticket
import org.json.JSONArray
import java.util.*

private const val TAG = "restCalls"

class restCalls {

    companion object {
        fun getTicketInfos(id: String) {
            AndroidNetworking.get("http://192.168.1.47:3003/ticketCheck/ticket/{ticketId}")
                .addPathParameter("ticketId", id)
                //.addQueryParameter("limit", "3")
                //.addHeaders("token", "1234")
                //.setTag("test")
                //.setPriority(Priority.LOW)
                .build()
                .getAsJSONArray(object : JSONArrayRequestListener {
                    override fun onResponse(response: JSONArray) {
                        Log.d(TAG, "onResponse: $response")
                        val ticket: Ticket = Ticket(
                            12,
                            "controller",
                            "passenger",
                            "normal",
                            "IZUBFR",
                            "Antibes",
                            "Cannes",
                            3,
                            Date(2020, 12, 2)
                        )
                    }

                    override fun onError(error: ANError) {
                        Log.e(TAG, "onError: $error")
                    }
                })
        }
    }
}