package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.myapplication.databinding.FragmentFraudCheckingScreenBinding

/**
 * A simple [Fragment] subclass.
 * Use the [FraudCheckingScreenFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class FraudCheckingScreenFragment : Fragment() {
    private var _binding: FragmentFraudCheckingScreenBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentFraudCheckingScreenBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.goToHomeBtn.setOnClickListener { findNavController().navigate(FraudCheckingScreenFragmentDirections.actionFraudCheckingScreenToHomePage()) }
    }

   
}