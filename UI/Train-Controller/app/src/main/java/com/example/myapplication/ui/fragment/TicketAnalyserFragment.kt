package com.example.myapplication.ui.fragment

import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.androidnetworking.AndroidNetworking
import com.androidnetworking.error.ANError
import com.androidnetworking.interfaces.JSONObjectRequestListener
import com.example.myapplication.R
import com.example.myapplication.data.models.Ticket
import com.example.myapplication.data.models.TicketError
import com.example.myapplication.databinding.FragmentTicketAnalyserBinding
import org.json.JSONObject
import java.time.LocalDate
import java.time.format.DateTimeFormatter

/**
 * A simple [Fragment] subclass.
 * Use the [TicketAnalyserFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
private const val TAG = "TicketAnalyserFragment"
class TicketAnalyserFragment : Fragment() {
    private var url :String = ""
    private val args: TicketAnalyserFragmentArgs by navArgs()
    private var binding: FragmentTicketAnalyserBinding? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = FragmentTicketAnalyserBinding.inflate(inflater, container, false).root


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentTicketAnalyserBinding.bind(view)
        url = getString(R.string.NODE_IP_ADDRESS)
        this.getTicketInfos(args.ticketNumber, "controller_id_1")
    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }

    private fun getTicketInfos(id: String, controllerId: String) {
        Log.d(TAG, "getTicketInfos: "+"http://$url:3003/ticketCheck/{ticketId}?controllerId={controllerId}")
        AndroidNetworking.get("http://$url:3003/ticketCheck/{ticketId}?controllerId={controllerId}")
            .addPathParameter("ticketId", id)
            .addPathParameter("controllerId", controllerId)
            //.addQueryParameter("limit", "3")
            //.addHeaders("token", "1234")
            //.setTag("test")
            //.setPriority(Priority.LOW)
            .build()
            .getAsJSONObject(object : JSONObjectRequestListener {
                @RequiresApi(Build.VERSION_CODES.O)
                override fun onResponse(response: JSONObject) {
                    if (!(response.get("result") as Boolean))
                    { //If result: 'false'
                        var ticket = Ticket()
                        var ticketError = TicketError("")
                        if (response.get("type") == "ticket unfound")
                        {
                            ticketError.error = "No ticket with id '$id' were found"
                            view?.post {
                                findNavController().navigate(TicketAnalyserFragmentDirections.actionTicketAnalyserFragmentToOptionalTestFragment(ticket, ticketError))
                            }
                        } else if(response.get("type") == "normal"){
                            val jsonTicket = response.getJSONObject("ticket");
                            ticket.id = jsonTicket.get("_id").toString()
                            ticket.controller = jsonTicket.get("controller").toString()
                            ticket.passengerName = jsonTicket.get("passengerName").toString()
                            ticket.type = jsonTicket.get("type").toString()
                            ticket.trainRef =  jsonTicket.get("trainRef").toString()
                            ticket.departure = jsonTicket.get("departure").toString()
                            ticket.destination = jsonTicket.get("destination").toString()
                            ticket.price = jsonTicket.get("price").toString().toFloat()
                            ticket.date = LocalDate.parse(jsonTicket.get("date").toString(), DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                            ticketError.error = "Error with ticket '$id'"
                            view?.post {
                                findNavController().navigate(TicketAnalyserFragmentDirections.actionTicketAnalyserFragmentToOptionalTestFragment(ticket, ticketError))
                            }
                        }
                    } else
                    {
                        val jsonTicket = response.getJSONObject("ticket");
                        var ticket = Ticket()
                        ticket.id = jsonTicket.get("_id").toString()
                        ticket.controller = jsonTicket.get("controller").toString()
                        ticket.passengerName = jsonTicket.get("passengerName").toString()
                        ticket.type = jsonTicket.get("type").toString()
                        ticket.trainRef =  jsonTicket.get("trainRef").toString()
                        ticket.departure = jsonTicket.get("departure").toString()
                        ticket.destination = jsonTicket.get("destination").toString()
                        ticket.price = jsonTicket.get("price").toString().toFloat()
                        ticket.date = LocalDate.parse(jsonTicket.get("date").toString(), DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                        var ticketError = TicketError("");
                        view?.post {
                            findNavController().navigate(TicketAnalyserFragmentDirections.actionTicketAnalyserFragmentToOptionalTestFragment(ticket, ticketError))
                        }
                    }
                }

                override fun onError(error: ANError) {
                    var txt = "Network error : $error\nAre you connected to the train Wifi ?"
                    view?.post {
                        findNavController().navigate(TicketAnalyserFragmentDirections.actionTicketAnalyserFragmentToConnectionIssuesFragment(txt, id))
                    }
                }
            })
    }
}