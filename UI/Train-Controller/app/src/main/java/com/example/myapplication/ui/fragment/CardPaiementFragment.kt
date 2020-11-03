package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.os.Handler
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.myapplication.R
import com.example.myapplication.databinding.FragmentCardPaiementBinding
import com.example.myapplication.databinding.FragmentFraudBinding

/**
 * A simple [Fragment] subclass.
 * Use the [CardPaiementFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class CardPaiementFragment : Fragment() {


    private var _binding: FragmentCardPaiementBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentCardPaiementBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        Handler().postDelayed({findNavController().navigate(CardPaiementFragmentDirections.actionCardPaiementFragmentToFraudCheckingScreen())}, 3000)
    }
}