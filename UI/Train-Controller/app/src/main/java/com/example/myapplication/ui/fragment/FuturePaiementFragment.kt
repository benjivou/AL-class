package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.myapplication.data.models.ClientFraudForm
import com.example.myapplication.databinding.FragmentFuturePaiementBinding

private const val TAG = "FuturePaiement"

/**
 * A simple [Fragment] subclass.
 * Use the [FuturePaiementFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class FuturePaiementFragment : Fragment() {
    private var _binding: FragmentFuturePaiementBinding? = null
    private val binding get() = _binding!!
    private var clientFraudForm: ClientFraudForm? = null
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentFuturePaiementBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.apply {
            goToFraudRecap.setOnClickListener {
                if (checkValidityInputs()) {

                    // Do the request

                    // redirect to next page
                }
            }
        }
    }

    private fun checkValidityInputs(): Boolean {

        return true
    }
}