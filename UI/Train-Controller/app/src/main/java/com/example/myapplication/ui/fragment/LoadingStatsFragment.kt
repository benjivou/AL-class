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
import com.example.myapplication.data.models.Fraud
import com.example.myapplication.data.models.Statistics
import com.example.myapplication.data.models.Ticket
import com.example.myapplication.data.models.TicketError
import com.example.myapplication.databinding.FragmentLoadingStatsBinding
import com.example.myapplication.databinding.FragmentOptionalTestBinding
import com.example.myapplication.databinding.FragmentStatisticsBinding
import org.json.JSONObject
import java.time.LocalDate
import java.time.format.DateTimeFormatter

private const val TAG = "LoadingStatsFragment"
class LoadingStatsFragment : Fragment() {
    private val args: LoadingStatsFragmentArgs by navArgs()
    private var binding: FragmentLoadingStatsBinding? = null
    private var url :String = ""

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_loading_stats, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?){
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentLoadingStatsBinding.bind(view)
        url = getString(R.string.NODE_IP_ADDRESS)
        val id = args.idController
        getNbControlledTickets(id)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }

    private fun getNbControlledTickets(controllerId: String) {
        Log.d(TAG, "getTicketInfos: "+"http://$url:3009/stats/controller/tickets/{controllerId}")
        AndroidNetworking.get("http://$url:3009/stats/controller/tickets/{controllerId}")
            .addPathParameter("controllerId", controllerId)
            //.addQueryParameter("limit", "3")
            //.addHeaders("token", "1234")
            //.setTag("test")
            //.setPriority(Priority.LOW)
            .build()
            .getAsJSONObject(object : JSONObjectRequestListener {
                @RequiresApi(Build.VERSION_CODES.O)
                override fun onResponse(response: JSONObject) {
                    var nbControlledTickets = response.get("nbControlledTickets").toString().toInt()
                    getNbFrauds(controllerId, nbControlledTickets)
                }


                override fun onError(error: ANError) {
                    var txt = "Network error : $error\nAre you connected to the train Wifi ?"
                    view?.post {
                        findNavController().navigate(LoadingStatsFragmentDirections.actionLoadingStatsToConnectionIssuesFragment(txt))
                    }
                }
            })
    }

    private fun getNbFrauds(controllerId: String, nbControlledTickets:Int) {
        Log.d(TAG, "getTicketInfos: "+"http://$url:3009/stats/controller/tickets/{controllerId}")
        AndroidNetworking.get("http://$url:3009/stats/controller/frauds/{controllerId}")
            .addPathParameter("controllerId", controllerId)
            //.addQueryParameter("limit", "3")
            //.addHeaders("token", "1234")
            //.setTag("test")
            //.setPriority(Priority.LOW)
            .build()
            .getAsJSONObject(object : JSONObjectRequestListener {
                @RequiresApi(Build.VERSION_CODES.O)
                override fun onResponse(response: JSONObject) {
                    val nbFrauds = response.get("nbFrauds").toString().toInt()
                    val stats = Statistics(nbControlledTickets, nbFrauds)
                    view?.post {
                        findNavController().navigate(LoadingStatsFragmentDirections.actionLoadingStatsToStats(stats))
                    }
                }


                override fun onError(error: ANError) {
                    var txt = "Network error : $error\nAre you connected to the train Wifi ?"
                    view?.post {
                        findNavController().navigate(TicketAnalyserFragmentDirections.actionTicketAnalyserFragmentToConnectionIssuesFragment(txt))
                    }
                }
            })
    }
}