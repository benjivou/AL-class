package com.example.myapplication

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.example.myapplication.databinding.FragmentTicketAnalyserBinding

/**
 * A simple [Fragment] subclass.
 * Use the [TicketAnalyserFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class TicketAnalyserFragment : Fragment() {

    private val args: TicketAnalyserFragmentArgs by navArgs()
    private var binding: FragmentTicketAnalyserBinding? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = FragmentTicketAnalyserBinding.inflate(inflater,container,false).root


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentTicketAnalyserBinding.bind(view)
        binding!!.resultTxt.text = args.ticketNumber

    }


    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }


}