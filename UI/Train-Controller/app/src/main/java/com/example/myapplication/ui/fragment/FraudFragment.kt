package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.example.myapplication.R
import com.example.myapplication.databinding.FragmentFraudBinding
import kotlinx.android.synthetic.main.fragment_fraud.view.*


/**
 * A simple [Fragment] subclass.
 * Use the [FraudFragment.newInstance] factory method to
 * create an instance of this fragment.
 */

private const val TAG = "FraudFragment"

class FraudFragment : Fragment() {
    private val args: FraudFragmentArgs by navArgs()
    private var _binding: FragmentFraudBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentFraudBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.factureFraudTxt.valueFraudTxt.text = getString(R.string.le_paiement_de_cette_fraude_est_de,args.fraud.fraudPrice.toString() )
        Log.d(TAG, "onViewCreated: ${args.fraud.fraudId}")

        binding.goToBlueCardPaiement.setOnClickListener {
            findNavController().navigate(FraudFragmentDirections.actionFraudToCardPaiementFragment(args.fraud.fraudPrice))
        }
        binding.goToCashPaiement.setOnClickListener {
            findNavController().navigate(FraudFragmentDirections.actionFraudToCashPaiementFragment(args.fraud.fraudPrice))
        }
        binding.goToFacturationPaiement.setOnClickListener {
            findNavController().navigate(FraudFragmentDirections.actionFraudToFuturePaiement(args.fraud.fraudPrice))
        }
    }


}