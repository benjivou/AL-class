package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.example.myapplication.R
import com.example.myapplication.databinding.FragmentOptionalTestBinding
import com.example.myapplication.databinding.FragmentTicketAnalyserBinding

/**
 * A simple [Fragment] subclass.
 * Use the [OptionalTestFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class OptionalTestFragment : Fragment() {
    private val args: OptionalTestFragmentArgs by navArgs()
    private var binding: FragmentOptionalTestBinding? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_optional_test, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?){
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentOptionalTestBinding.bind(view)
        var toBeDisplayed = ""
        if(args.ticketError.error !== ""){
             toBeDisplayed += args.ticketError.toString()
        }
        if(args.ticket.id !== ""){
            //Ticket found
            toBeDisplayed += args.ticket.toString()
        }
        binding!!.infoTxt.text = toBeDisplayed

    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }

}