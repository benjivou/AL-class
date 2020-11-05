package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.example.myapplication.R
import com.example.myapplication.data.models.Statistics
import com.example.myapplication.databinding.FragmentStatisticsBinding

class StatisticsFragment : Fragment() {
    private val args: StatisticsFragmentArgs by navArgs()
    private var binding: FragmentStatisticsBinding? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_statistics, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?){
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentStatisticsBinding.bind(view)
        val stats:Statistics = args.stats
        binding!!.nbOfControlledTickets.text = stats.nbControlledTickets.toString()
        binding!!.nbOfFrauds.text = stats.nbFrauds.toString()
        binding!!.returnHomeButton.setOnClickListener {
            findNavController().navigate(StatisticsFragmentDirections.actionStatsToHomePage())
        }

    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }
}