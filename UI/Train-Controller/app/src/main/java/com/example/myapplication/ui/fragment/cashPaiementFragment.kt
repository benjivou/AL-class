package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.myapplication.R
import com.example.myapplication.databinding.FragmentCardPaiementBinding
import com.example.myapplication.databinding.FragmentCashPaiementBinding

/**
 * A simple [Fragment] subclass.
 * Use the [CashPaiementFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class CashPaiementFragment : Fragment() {
    private var _binding: FragmentCashPaiementBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentCashPaiementBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.validBtn2.setOnClickListener {  }
    }

}