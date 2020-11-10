package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.myapplication.R
import com.example.myapplication.databinding.FragmentManuallFraudFormulaireBinding

/**
 * A simple [Fragment] subclass.
 * Use the [ManuallFraudFormulaireFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
private const val TAG = "ManuallFraudFormulaire"
class ManuallFraudFormulaireFragment : Fragment() {
    private var _binding: FragmentManuallFraudFormulaireBinding? = null
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
        binding.spinner.adapter = ArrayAdapter(
            requireContext(),
            android.R.layout.simple_spinner_item,
            resources.getStringArray(R.array.fraud_types)
        )

        binding.apply {
            this.goToFraudePageBtn.setOnClickListener {
                Log.d(TAG, "onViewCreated: ${spinner.selectedItem} ")
                findNavController().navigate(
                    ManuallFraudFormulaireFragmentDirections.actionManuallFraudFormulaireToAmountFraudFragment(
                        spinner.selectedItem.toString()
                    )
                )
            }
        }

    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}