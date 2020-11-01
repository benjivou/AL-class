package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.myapplication.R
import com.example.myapplication.data.models.Ticket
import com.example.myapplication.databinding.FragmentTicketInputBinding
import kotlinx.android.synthetic.main.fragment_ticket_input.*

/**
 * A simple [Fragment] subclass.
 * Use the [TicketInputFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
private const val TAG = "TicketInputFragment"

class TicketInputFragment : Fragment() {
    private var binding: FragmentTicketInputBinding? = null
    private var ticket: Ticket? = null

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
            val ticketId = binding!!.editText.text
            if (!ticketId.isNullOrEmpty()) {
                Log.d(TAG, "onViewCreated: $ticketId")
                findNavController().navigate(
                    TicketInputFragmentDirections.actionTicketInputFragmentToTicketAnalyserFragment(
                        editText.text.toString()
                    )
                )
            }
        }
    }
}
