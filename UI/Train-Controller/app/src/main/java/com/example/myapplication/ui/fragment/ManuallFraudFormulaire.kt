package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Adapter
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import com.example.myapplication.R
import com.example.myapplication.databinding.FragmentManuallFraudFormulaireBinding
import com.example.myapplication.ui.adapter.FraudAdapter

/**
 * A simple [Fragment] subclass.
 * Use the [ManuallFraudFormulaire.newInstance] factory method to
 * create an instance of this fragment.
 */
class ManuallFraudFormulaire : Fragment() {
    private var _binding : FragmentManuallFraudFormulaireBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentManuallFraudFormulaireBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.spinner.adapter = FraudAdapter()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}