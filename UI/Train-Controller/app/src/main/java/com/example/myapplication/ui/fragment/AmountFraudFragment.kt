package com.example.myapplication.ui.fragment

import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.androidnetworking.AndroidNetworking
import com.androidnetworking.error.ANError
import com.androidnetworking.interfaces.JSONObjectRequestListener
import com.example.myapplication.R
import com.example.myapplication.data.models.Fraud
import com.example.myapplication.databinding.FragmentAmountFraudBinding
import org.json.JSONObject

private const val TAG = "AmountFraudFragment"

class AmountFraudFragment : Fragment() {
    private var _binding: FragmentAmountFraudBinding? = null
    private val binding get() = _binding!!
    private val args: AmountFraudFragmentArgs by navArgs()
    private var url: String = ""
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentAmountFraudBinding.inflate(inflater, container, false)
        val view = binding.root
        url = getString(R.string.NODE_IP_ADDRESS)
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        Log.d(TAG, "onViewCreated: launching request")
        AndroidNetworking
            .post("http://$url:3006/declare/fraud")
            .addBodyParameter("type", args.fraudType)
            .addBodyParameter(
                "controller",
                "5f99ac7584b0c83808bb1a95"
            ) // TODO Change it by the current controller id
            .build()
            .getAsJSONObject(object : JSONObjectRequestListener {
                @RequiresApi(Build.VERSION_CODES.O)
                override fun onResponse(response: JSONObject) {
                    Log.d(TAG, "onResponse: request receive ${response.toString(1)}")
                    findNavController().navigate(
                        AmountFraudFragmentDirections.actionAmountFraudFragmentToFraud(
                            Fraud(
                                response.getString("fraudId"),
                                response.getDouble("fraudPrice").toFloat()
                            )
                        )
                    )
                }

                override fun onError(error: ANError) {
                    Log.e(TAG, "onError: ${error.errorBody}");
                }
            })

    }

}