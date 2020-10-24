package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import com.androidnetworking.AndroidNetworking
import com.androidnetworking.error.ANError
import com.androidnetworking.interfaces.JSONArrayRequestListener
import com.example.myapplication.R
import com.example.myapplication.data.restCalls
import com.example.myapplication.databinding.FragmentTicketAnalyserBinding
import com.example.myapplication.databinding.FragmentTicketInputBinding
import kotlinx.android.synthetic.main.fragment_ticket_input.*
import kotlinx.android.synthetic.main.scan_qr_fragment.*
import org.json.JSONArray

/**
 * A simple [Fragment] subclass.
 * Use the [TicketInputFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
private const val TAG = "TicketInputFragment"
class TicketInputFragment : Fragment() {
    private var binding: FragmentTicketInputBinding? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_ticket_input, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentTicketInputBinding.bind(view)
        binding!!.validTicketBtn?.setOnClickListener {
            val ticketId = binding!!.editTextNumber.text
            if(!ticketId.isNullOrEmpty()){
                Log.d(TAG, "onViewCreated: $ticketId")
                restCalls.getTicketInfos(ticketId.toString())
            }
            findNavController().navigate(TicketInputFragmentDirections.actionTicketInputFragmentToTicketAnalyserFragment(editTextNumber.text.toString())) }
    }

}